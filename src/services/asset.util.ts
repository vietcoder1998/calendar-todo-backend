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
 * @param name Asset name (from item name/title)
 * @param typeName AssetType name (e.g., 'todo', 'file', ...)
 */
export async function createAsset(name: string, typeName: string) {
  const assetType = await getOrCreateAssetType(typeName);
  const asset = await prisma.asset.create({
    data: {
      name,
      typeId: assetType.id,
    },
  });
  return asset.id;
}
