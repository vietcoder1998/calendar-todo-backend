import { Asset, AssetType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAssets = async (projectId?: string): Promise<(Asset & { type: AssetType })[]> => {
  if (projectId) {
    // Aggregate all unique assets related to the project via all relations
    const [todoAssets, fileAssets, locationAssets, ganttAssets, linkedAssets] = await Promise.all([
      prisma.asset.findMany({ where: { todos: { some: { projectId } } }, include: { type: true } }),
      prisma.asset.findMany({ where: { files: { some: { projectId } } }, include: { type: true } }),
      prisma.asset.findMany({
        where: { locations: { some: { projectId } } },
        include: { type: true },
      }),
      prisma.asset.findMany({
        where: { ganttTasks: { some: { projectId } } },
        include: { type: true },
      }),
      prisma.asset.findMany({
        where: { linkedItems: { some: { projectId } } },
        include: { type: true },
      }),
    ]);
    // Merge and deduplicate by asset id
    const all = [...todoAssets, ...fileAssets, ...locationAssets, ...ganttAssets, ...linkedAssets];
    // Deduplicate by asset id (group by id)
    const seen = new Set<string>();
    const unique = all.filter((asset) => {
      if (seen.has(asset.id)) return false;
      seen.add(asset.id);
      return true;
    });
    return unique;
  }
  return prisma.asset.findMany({ include: { type: true } });
};

export const getAssetById = async (id: string): Promise<(Asset & { type: any }) | null> => {
  return prisma.asset.findUnique({ where: { id }, include: { type: true } });
};

export const createAsset = async (
  data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Asset> => {
  return prisma.asset.create({
    data,
  });
};

export const updateAsset = async (id: string, updates: Partial<Asset>): Promise<Asset | null> => {
  try {
    return await prisma.asset.update({ where: { id }, data: updates });
  } catch {
    return null;
  }
};

export const deleteAsset = async (id: string): Promise<boolean> => {
  try {
    await prisma.asset.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
};
