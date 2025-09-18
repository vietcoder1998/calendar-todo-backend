import { Permission as PermissionType } from '../types';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const fromPrismaPermission = (prismaPermission: any): PermissionType => ({
  id: prismaPermission.id,
  type: prismaPermission.type,
  resource: prismaPermission.resource,
  userId: prismaPermission.userId,
  projectId: prismaPermission.projectId,
  createdAt: prismaPermission.createdAt
    ? (prismaPermission.createdAt.toISOString?.() ?? prismaPermission.createdAt)
    : null,
  updatedAt: prismaPermission.updatedAt
    ? (prismaPermission.updatedAt.toISOString?.() ?? prismaPermission.updatedAt)
    : null,
});

export const getPermissions = async (projectId?: string) => {
  if (projectId) {
    const permissions = await prisma.permission.findMany({
      where: { projectId: { equals: projectId } },
    });
    return permissions.map(fromPrismaPermission);
  }
  const permissions = await prisma.permission.findMany();
  return permissions.map(fromPrismaPermission);
};
export const createPermission = async (permission: PermissionType) => {
  const created = await prisma.permission.create({ data: permission });
  return fromPrismaPermission(created);
};
export const updatePermission = async (id: string, updates: Partial<PermissionType>) => {
  try {
    const updated = await prisma.permission.update({ where: { id }, data: updates });
    return fromPrismaPermission(updated);
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
export const getPermissionsByResourceType = async (projectId: string, resourceType: string) => {
  // resourceType: 'user', 'file', 'linked-item', 'webhook', 'history', 'location', etc.
  const permissions = await prisma.permission.findMany({
    where: {
      projectId,
      resource: { contains: resourceType },
    },
  });
  return permissions.map(fromPrismaPermission);
};
