import { Prisma, PrismaClient } from '@prisma/client';
import { createAsset } from './asset.util';
import { LinkedItem } from '@/types';
const prisma = new PrismaClient();

export const getLinkedItems = async (projectId?: string) => {
  if (projectId) {
    const items = await prisma.linkedItem.findMany({ where: { projectId: projectId } });
    return items.map((i: LinkedItem) => ({
      ...i,
      description: i.description ?? null,
      status: i.status ?? null,
      assetId: i.assetId ?? null,
    }));
  }
  const items = await prisma.linkedItem.findMany();
  return items.map((i: LinkedItem) => ({
    ...i,
    description: i.description ?? null,
    status: i.status ?? null,
    assetId: i.assetId ?? null,
  }));
};
export const createLinkedItem = async (item: LinkedItem) => {
  // Create asset and link
  let assetId: string | null = null;
  if (item.title) {
    assetId = await createAsset(item.title, 'linkedItem');
  }

  if (!assetId) {
    assetId = 'default-asset-id'; // Fallback asset ID
  }

  // Ensure projectId is set
  if (!item.projectId) {
    throw new Error('projectId is required to create a linked item');
  }
  const i = await prisma.linkedItem.create({
    data: { ...item, assetId, projectId: item.projectId },
  });
  return {
    ...i,
    description: i.description ?? null,
    status: i.status ?? null,
    assetId: i.assetId ?? null,
  };
};
export const updateLinkedItem = async (id: string, updates: Partial<LinkedItem>) => {
  try {
    const i = await prisma.linkedItem.update({ where: { id }, data: updates });
    return {
      ...i,
      description: i.description ?? null,
      status: i.status ?? null,
      assetId: i.assetId ?? null,
    };
  } catch {
    return null;
  }
};
export const deleteLinkedItem = async (id: string) => {
  try {
    await prisma.linkedItem.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
};
