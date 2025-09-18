import { PrismaClient } from '@prisma/client';
import { FileItem as FileItemType } from '../types';
import { createAsset } from './asset.util';
const prisma = new PrismaClient();

const fromPrismaFile = (prismaFile: any): FileItemType => ({
  id: prismaFile.id,
  name: prismaFile.name ?? null,
  url: prismaFile.url ?? null,
  createdAt: prismaFile.createdAt
    ? (prismaFile.createdAt.toISOString?.() ?? prismaFile.createdAt)
    : null,
  updatedAt: prismaFile.updatedAt
    ? (prismaFile.updatedAt.toISOString?.() ?? prismaFile.updatedAt)
    : null,
  projectId: prismaFile.projectId,
  assetId: prismaFile.assetId ?? null,
});

export const getFiles = async (projectId?: string) => {
  if (projectId) {
    const files = await prisma.fileItem.findMany({ where: { projectId: { equals: projectId } } });
    return files.map(fromPrismaFile);
  }
  const files = await prisma.fileItem.findMany();
  return files.map(fromPrismaFile);
};
export const createFile = async (file: FileItemType) => {
  // Create asset and link if name is present
  let assetId: string | null = null;
  if (file.name) {
    assetId = await createAsset(file.name, 'file');
  }
  const created = await prisma.fileItem.create({
    data: {
      ...file,
      assetId,
      projectId: file.projectId,
    },
  });
  return fromPrismaFile(created);
};
export const updateFile = async (id: string, updates: Partial<FileItemType>) => {
  try {
    const updated = await prisma.fileItem.update({ where: { id }, data: updates });
    return fromPrismaFile(updated);
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
