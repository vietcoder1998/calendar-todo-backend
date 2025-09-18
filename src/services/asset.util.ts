import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get or create an AssetType by name.
 */
export async function getOrCreateAssetType(name: string) {
  let assetType = await prisma.assetType.findUnique({ where: { name } });
  if (!assetType) {
    assetType = await prisma.assetType.create({ data: { name } });
  }
  return assetType;
}

/**
 * Create an Asset and return its id.
 * Also create default permissions (edit, view, comment, delete) for the asset for the project owner.
 * @param name Asset name (from item name/title)
 * @param typeName AssetType name (e.g., 'todo', 'file', ...)
 * @param projectId Project id to link permission
 * @param ownerId User id of the project owner
 */
export async function createAsset(name: string, typeName: string, projectId?: string) {
  try {
    const assetType = await getOrCreateAssetType(typeName);
    const asset = await prisma.asset.create({
      data: {
        name,
        typeId: assetType.id,
      },
    });

    // Find the admin user in the database
    let finalOwnerId = 'admin';
    const adminUser = await prisma.user.findFirst({ where: { name: 'Admin', projectId } });
    if (adminUser) {
      finalOwnerId = adminUser.id;
    }
    if (projectId) {
      const actions = ['edit', 'view', 'comment', 'delete'];
      const permissionData = actions.map((type) => ({
        id: `${type}:asset:${asset.id}:${finalOwnerId}`,
        type,
        resource: `asset:${asset.id}`,
        userId: finalOwnerId,
        projectId,
      }));
      await prisma.permission.createMany({ data: permissionData });
    }
    return asset.id;
  } catch (e) {
    console.error('Failed to create asset or permissions:', e);
    return null;
  }
}
