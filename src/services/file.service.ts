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
  status: prismaFile.status ?? null,
  position: prismaFile.position ?? null,
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

  let position = file.position ?? 0;
  if (position == null && file.projectId) {
    const max = await prisma.fileItem.aggregate({
      where: { projectId: file.projectId },
      _max: { position: true },
    });
    position = (max._max?.position ?? 0) + 1;
  }
  const created = await prisma.fileItem.create({
    data: {
      ...file,
      assetId,
      projectId: file.projectId,
      position,
      status: file.status ?? 1,
    },
  });
  return fromPrismaFile(created);
};
export const updateFile = async (id: string, updates: Partial<FileItemType>) => {
  try {
    const updateData: any = { ...updates };
    if ('status' in updates) {
      updateData.status = updates.status ?? 1;
    }
    if (updateData.projectId === undefined) {
      delete updateData.projectId;
    }
    const updated = await prisma.fileItem.update({ where: { id }, data: updateData });
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
