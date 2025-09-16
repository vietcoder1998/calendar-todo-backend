import { PrismaClient, Permission as PrismaPermission } from '@prisma/client';
const prisma = new PrismaClient();

export const getPermissions = async (projectId?: string) => {
  if (projectId) {
    return prisma.permission.findMany({ where: { projectId: { equals: projectId } } });
  }
  return prisma.permission.findMany();
};
export const createPermission = async (permission: PrismaPermission) => {
  return prisma.permission.create({ data: permission });
};
export const updatePermission = async (id: string, updates: Partial<PrismaPermission>) => {
  try {
    return await prisma.permission.update({ where: { id }, data: updates });
  } catch {
    return null;
  }
};
export const deletePermission = async (id: string) => {
  try {
    await prisma.permission.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
};
