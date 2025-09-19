import type { Permission as LocalPermission } from '../types';
import { PrismaClient, Permission as PrismaPermission } from '@prisma/client';
const prisma = new PrismaClient();

// Map Prisma Permission to local Permission type, handling new fields
const fromPrismaPermission = (prismaPermission: any): LocalPermission => ({
  id: prismaPermission.id,
  type: prismaPermission.type,
  resource: prismaPermission.resource,
  userId: prismaPermission.userId,
  projectId: prismaPermission.projectId,
  assetId: prismaPermission.assetId ?? null,
  asset: prismaPermission.asset ?? undefined,
  label: prismaPermission.label ?? null,
  status: typeof prismaPermission.status === 'number' ? prismaPermission.status : undefined,
  createdAt: prismaPermission.createdAt
    ? typeof prismaPermission.createdAt === 'string'
      ? prismaPermission.createdAt
      : (prismaPermission.createdAt.toISOString?.() ?? prismaPermission.createdAt)
    : null,
  updatedAt: prismaPermission.updatedAt
    ? typeof prismaPermission.updatedAt === 'string'
      ? prismaPermission.updatedAt
      : (prismaPermission.updatedAt.toISOString?.() ?? prismaPermission.updatedAt)
    : null,
});

export const getPermissions = async (projectId?: string): Promise<LocalPermission[]> => {
  const where = projectId ? { projectId: { equals: projectId } } : undefined;
  const permissions = await prisma.permission.findMany({
    where,
    include: { asset: true },
  });
  return permissions.map(fromPrismaPermission);
};

export const createPermission = async (permission: LocalPermission): Promise<LocalPermission> => {
  // Only send fields that exist in Prisma schema
  const { id, asset, ...data } = permission;
  const created = await prisma.permission.create({ data: data as any, include: { asset: true } });
  return fromPrismaPermission(created);
};
export const updatePermission = async (
  id: string,
  updates: Partial<LocalPermission>,
): Promise<LocalPermission | null> => {
  try {
    const { asset, ...data } = updates;
    const updated = await prisma.permission.update({
      where: { id },
      data: data as any,
      include: { asset: true },
    });
    return fromPrismaPermission(updated);
  } catch {
    return null;
  }
};
export const deletePermission = async (id: string): Promise<boolean> => {
  try {
    await prisma.permission.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
};
export const getPermissionsByResourceType = async (
  projectId: string,
  resourceType: string,
): Promise<LocalPermission[]> => {
  // resourceType: 'user', 'file', 'linked-item', 'webhook', 'history', 'location', etc.
  const permissions = await prisma.permission.findMany({
    where: {
      projectId,
      resource: { contains: resourceType },
    },
    include: { asset: true },
  });
  return permissions.map(fromPrismaPermission);
};
