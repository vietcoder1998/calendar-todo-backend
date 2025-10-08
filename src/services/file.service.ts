import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';
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
export const createFile = async (fileData: FileItemType) => {
  let assetId: string | null = null;
  let position = fileData.position ?? 0;
  if (position == null && fileData.projectId) {
    const max = await prisma.fileItem.aggregate({
      where: { projectId: fileData.projectId },
      _max: { position: true },
    });
    position = (max._max?.position ?? 0) + 1;
  }

  // If fileData._upload is present, handle local upload
  if ((fileData as any)._upload) {
    const upload = (fileData as any)._upload as { buffer: Buffer; originalname: string };
    const uploadDir = path.resolve(__dirname, '../../uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const filename = `${Date.now()}_${upload.originalname}`;
    const filepath = path.join(uploadDir, filename);
    await fs.writeFile(filepath, upload.buffer);
    fileData.url = `/uploads/${filename}`;
  }

  const created = await prisma.fileItem.create({
    data: {
      ...fileData,
      assetId,
      projectId: fileData.projectId,
      position,
      status: fileData.status ?? 1,
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
