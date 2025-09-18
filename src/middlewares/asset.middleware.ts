import { Request, Response, NextFunction } from 'express';
import { createAsset } from '../services/asset.util';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Middleware: On POST, create an asset and attach assetId to req.body
export async function attachAssetOnCreate(req: Request, res: Response, next: NextFunction) {
  // Override res.json to always include assetId if present
  const oldJson = res.json;
  res.json = function (body: any) {
    if (req.body.assetId && body && typeof body === 'object' && !('assetId' in body)) {
      if (body.data && typeof body.data === 'object') {
        body.data.assetId = req.body.assetId;
      } else {
        body.data = { ...(body.data || {}), assetId: req.body.assetId };
      }
    }
    return oldJson.call(this, body);
  };
  if (req.method === 'POST') {
    const { name, projectId } = req.body;
    const typeNameWithPath = req.headers['x-asset-type'] as string;
    if (name && typeNameWithPath && projectId) {
      const assetId = await createAsset(name, typeNameWithPath, projectId);
      if (assetId) {
        req.body.assetId = assetId;
        // Also ensure permissions for admin (redundant if createAsset already does this, but safe)
        const adminUser = await prisma.user.findFirst({ where: { name: 'Admin', projectId } });
        const finalOwnerId = adminUser ? adminUser.id : 'admin';
        const actions = ['edit', 'view', 'comment', 'delete'];
        const permissionData = actions.map((type) => ({
          id: `${type}:asset:${assetId}:${finalOwnerId}`,
          type,
          resource: `asset:${assetId}`,
          userId: finalOwnerId,
          projectId,
        }));
        await prisma.permission.createMany({ data: permissionData, skipDuplicates: true });
        // No direct return here, let controller/middleware handle response
      }
    }
  }
  next();
}

// Middleware: On PATCH/PUT, add a history entry after update
export async function addHistoryOnUpdate(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'PATCH' || req.method === 'PUT') {
    // Wait for the controller to finish
    res.on('finish', async () => {
      const { id } = req.params;
      const { projectId } = req.body;
      if (id && projectId) {
        await prisma.history.create({
          data: {
            id: `${id}:${Date.now()}`,
            type: 'asset',
            action: 'update',
            payload: req.body,
            date: new Date(),
            timestamp: Date.now().toString(),
            user: 'system',
          },
        });
      }
    });
  }
  next();
}
