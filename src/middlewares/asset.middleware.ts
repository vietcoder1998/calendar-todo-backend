import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { createAsset } from '../services/asset.util';
import logger from '../logger';

const prisma = new PrismaClient();

// Middleware: On POST, create an asset and attach assetId to req.body
export async function attachAssetOnCreate(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'POST') {
    const projectId = String(req.headers['x-project-id'] ?? '');
    const typeNameWithPath = req.headers['x-asset-type'] as string;
    const assetName: string = String(
      req.body.name ?? req.body.title ?? req.headers['x-asset-type'],
    );

    if (assetName && typeNameWithPath && projectId) {
      const assetId = await createAsset(assetName, typeNameWithPath, projectId);
      if (assetId) {
        req.body.assetId = assetId;
        console.log('assetId', assetId);
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
        const data = await prisma.permission.createMany({
          data: permissionData,
          skipDuplicates: true,
        });
        logger.info('Pemssiion created:', JSON.stringify(data));
        // No direct return here, let controller/middleware handle response
      }

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
    }
  }

  next();
}

// Middleware: On PATCH/PUT, add a history entry after update
export async function addHistoryOnUpdate(req: Request, res: Response, next: NextFunction) {
  console.log(req.method);
  if (req.method === 'PATCH' || req.method === 'PUT') {
    // Wait for the controller to finish
    res.on('finish', async () => {
      const projectId: string = String(req.headers['x-project-id'] ?? '');
      console.log('projectId', projectId);
      if (projectId) {
        const project = await prisma.project.findFirst({ where: { id: projectId } });
        if (project) {
          const history = await prisma.history.create({
            data: {
              id: `${projectId}:${Date.now()}`,
              type: 'asset',
              action: 'update',
              payload: req.body,
              date: new Date(),
              timestamp: Date.now().toString(),
              user: 'system',
            },
          });
          logger.info(history);
          if (!res.headersSent) {
            res.setHeader('x-history-id', history.id);
          }
        }
      }
    });
  }
  next();
}
