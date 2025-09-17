import { FileItem, PrismaClient } from '@prisma/client';
import { createAsset } from './asset.util';
const prisma = new PrismaClient();

export const getFiles = async (projectId?: string) => {
  if (projectId) {
    return prisma.fileItem.findMany({ where: { projectId: { equals: projectId } } });
  }
  return prisma.fileItem.findMany();
};
export const createFile = async (file: FileItem) => {
  // Create asset and link if name is present
  let assetId: string | null = null;
  if (file.name) {
    assetId = await createAsset(file.name, 'file');
  }
  return prisma.fileItem.create({
    data: {
      ...file,
      assetId,
      projectId: file.projectId,
    },
  });
};
export const updateFile = async (id: string, updates: Partial<FileItem>) => {
  try {
    return await prisma.fileItem.update({ where: { id }, data: updates });
  } catch {
    return null;
  }
};
export const deleteFile = async (id: string) => {
  try {
    await prisma.fileItem.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
};
