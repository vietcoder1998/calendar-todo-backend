import { PrismaClient, Asset } from '@prisma/client';

const prisma = new PrismaClient();

export const getAssets = async (projectId?: string): Promise<Asset[]> => {
  if (projectId) {
    return prisma.asset.findMany({
      where: {
        OR: [
          { todos: { some: { projectId } } },
          { files: { some: { projectId } } },
          { locations: { some: { projectId } } },
          { ganttTasks: { some: { projectId } } },
          { linkedItems: { some: { projectId } } },
        ],
      },
    });
  }
  return prisma.asset.findMany();
};

export const getAssetById = async (id: string): Promise<Asset | null> => {
  return prisma.asset.findUnique({ where: { id } });
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
