import { PrismaClient, LinkedItem as PrismaLinkedItem } from '@prisma/client';
const prisma = new PrismaClient();

export const getLinkedItems = async (projectId?: string) => {
  if (projectId) {
    return prisma.linkedItem.findMany({ where: { projectId: projectId } });
  }
  return prisma.linkedItem.findMany();
};
export const createLinkedItem = async (item: PrismaLinkedItem) => {
  return prisma.linkedItem.create({ data: item });
};
export const updateLinkedItem = async (id: string, updates: Partial<PrismaLinkedItem>) => {
  try {
    return await prisma.linkedItem.update({ where: { id }, data: updates });
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
