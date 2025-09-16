import { FileItem, PrismaClient, FileItem as PrismaFileItem } from '@prisma/client';
const prisma = new PrismaClient();

export const getFiles = async (projectId?: string) => {
  if (projectId) {
    return prisma.fileItem.findMany({ where: { projectId: { equals: projectId } } });
  }
  return prisma.fileItem.findMany();
};
export const createFile = async (file: FileItem) => {
  return prisma.fileItem.create({ data: file });
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
