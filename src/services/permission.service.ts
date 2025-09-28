import { Permission } from '@/types';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Map Prisma Permission to local Permission type, handling new fields
const fromPrismaPermission = (prismaPermission: any): Permission => ({
  id: prismaPermission.id,
  type: prismaPermission.type,
  resource: prismaPermission.resource,
  userId: prismaPermission.userId,
  projectId: prismaPermission.projectId,
  assetId: prismaPermission.assetId ?? null,
  asset: prismaPermission.asset
    ? {
        id: prismaPermission.asset.id,
        name: prismaPermission.asset.name,
        type: prismaPermission.asset.type,
        url: prismaPermission.asset.url,
      }
    : undefined,
  label: prismaPermission.label ?? null,
  name: prismaPermission.name ?? 'Permission', // default name
  description: prismaPermission.description ?? undefined,
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
  users: prismaPermission.users ?? undefined,
});

export const getPermissions = async (
  projectId?: string,
  pageIndex: number = 0,
  pageSize: number = 50,
  q: string = '',
): Promise<Permission[]> => {
  const where: any = { status: { not: -2 } };
  if (projectId) where.projectId = { equals: projectId };
  if (q) {
    where.OR = [
      { type: { contains: q } },
      { resource: { contains: q } },
      { userId: { contains: q } },
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }
  const permissions = await prisma.permission.findMany({
    where,
    include: { asset: true, users: true },
    skip: pageIndex * pageSize,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
  });
  return permissions.map(fromPrismaPermission);
};

export const createPermission = async (permission: Permission): Promise<Permission> => {
  // Only send fields that exist in Prisma schema
  const { asset, ...data } = permission;
  const dataToCreate = {
    ...data,
    name: data.name || 'Permission',
    description: data.description || undefined,
    users: { connect: { id: permission.userId } },
  };
  const created = await prisma.permission.create({
    data: dataToCreate,
    include: { asset: true, users: true },
  });
  return fromPrismaPermission(created);
};

export const createManyPermissions = async (
  permissions: Array<{
    id: string;
    type: string;
    resource: string;
    userId: string;
    projectId: string;
    assetId?: string | null;
    label?: string | null;
    name?: string;
    description?: string;
    status?: number;
  }>,
): Promise<void> => {
  // Create all permissions in batch (without users relation)
  await prisma.permission.createMany({
    data: permissions.map(
      ({ id, type, resource, userId, projectId, assetId, label, name, description, status }) => ({
        id,
        type,
        resource,
        userId,
        projectId,
        assetId,
        label,
        name: name || 'Permission',
        description,
        status,
      }),
    ),
    skipDuplicates: true,
  });
  // Connect users relation for each permission
  await Promise.all(
    permissions.map(async (perm) => {
      await prisma.permission.update({
        where: { id: perm.id },
        data: { users: { connect: { id: perm.userId } } },
      });
    }),
  );
};

export const updatePermission = async (
  id: string,
  updates: Partial<Permission>,
): Promise<Permission | null> => {
  try {
    const { asset, ...data } = updates;
    const dataToUpdate = {
      ...data,
      name: data.name || 'Permission',
      description: data.description || undefined,
    };
    const updated = await prisma.permission.update({
      where: { id },
      data: dataToUpdate as any,
      include: { asset: true, users: true },
    });
    return fromPrismaPermission(updated);
  } catch {
    return null;
  }
};

export const deletePermission = async (id: string): Promise<boolean> => {
  try {
    await prisma.permission.update({
      where: { id },
      data: { status: -1 },
    });
    return true;
  } catch {
    return false;
  }
};

export const getPermissionsByResourceType = async (
  projectId: string,
  resourceType: string,
  pageIndex: number = 0,
  pageSize: number = 50,
  q: string = '',
): Promise<Permission[]> => {
  const where: any = {
    projectId,
    resource: { contains: resourceType },
    status: { not: -2 },
  };
  if (q) {
    where.OR = [
      { type: { contains: q } },
      { resource: { contains: q } },
      { userId: { contains: q } },
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }
  const permissions = await prisma.permission.findMany({
    where,
    include: { asset: true, users: true },
    skip: pageIndex * pageSize,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
  });
  return permissions.map(fromPrismaPermission);
};
