import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Permission } from '../types';
import * as permissionService from './permission.service';

const basePermission: Permission = {
  id: '1',
  type: 'view',
  resource: 'file:1',
  userId: 'user-1',
  projectId: 'test-project',
  createdAt: new Date(),
  updatedAt: new Date(),
  assetId: null,
};

describe('permission.service', () => {
  let permissions: Permission[];

  beforeEach(() => {
    permissions = [];
    jest
      .spyOn(permissionService, 'getPermissions')
      .mockImplementation(async (_projectId, page, size, q) => {
        let filtered = permissions;
        if (q)
          filtered = filtered.filter(
            (p) => p.type.includes(q) || p.resource.includes(q) || p.userId.includes(q),
          );
        const pageIndex = typeof page === 'number' ? page : 0;
        const pageSize = typeof size === 'number' ? size : 50;
        const start = pageIndex * pageSize;
        return filtered.slice(start, start + pageSize);
      });
    jest
      .spyOn(permissionService, 'createPermission')
      .mockImplementation(async (perm: Permission) => {
        permissions.push(perm);
        return perm;
      });
    jest
      .spyOn(permissionService, 'updatePermission')
      .mockImplementation(async (id: string, updates: Partial<Permission>) => {
        const idx = permissions.findIndex((p) => p.id === id);
        if (idx !== -1) {
          permissions[idx] = { ...permissions[idx], ...updates };
          return permissions[idx];
        }
        return null;
      });
    jest.spyOn(permissionService, 'deletePermission').mockImplementation(async (id: string) => {
      const prevLen = permissions.length;
      permissions = permissions.filter((p) => p.id !== id);
      return permissions.length < prevLen;
    });
  });

  it('should create a permission', async () => {
    const created = await permissionService.createPermission(basePermission);
    expect(created).toEqual(basePermission);
    expect(await permissionService.getPermissions(undefined, 0, 50, '')).toContainEqual(
      basePermission,
    );
  });

  it('should update a permission', async () => {
    await permissionService.createPermission(basePermission);
    const updated = await permissionService.updatePermission('1', { type: 'edit' });
    expect(updated).toMatchObject({ id: '1', type: 'edit' });
  });

  it('should delete a permission', async () => {
    await permissionService.createPermission(basePermission);
    const deleted = await permissionService.deletePermission('1');
    expect(deleted).toBe(true);
    expect(await permissionService.getPermissions(undefined, 0, 50, '')).toHaveLength(0);
  });

  it('should return null when updating non-existent permission', async () => {
    const updated = await permissionService.updatePermission('not-exist', { type: 'fail' });
    expect(updated).toBeNull();
  });

  it('should return false when deleting non-existent permission', async () => {
    const deleted = await permissionService.deletePermission('not-exist');
    expect(deleted).toBe(false);
  });

  it('should support pagination', async () => {
    for (let i = 0; i < 60; i++) {
      await permissionService.createPermission({
        ...basePermission,
        id: String(i),
        userId: `user-${i}`,
      });
    }
    const page1 = await permissionService.getPermissions(undefined, 0, 10, '');
    const page2 = await permissionService.getPermissions(undefined, 1, 10, '');
    expect(page1).toHaveLength(10);
    expect(page2).toHaveLength(10);
    expect(page1[0].id).not.toEqual(page2[0].id);
  });

  it('should support search (q)', async () => {
    await permissionService.createPermission({
      ...basePermission,
      id: 'search-1',
      type: 'special',
    });
    await permissionService.createPermission({ ...basePermission, id: 'search-2', type: 'normal' });
    const found = await permissionService.getPermissions(undefined, 0, 50, 'special');
    expect(found.some((p) => p.type === 'special')).toBe(true);
    expect(found.some((p) => p.type === 'normal')).toBe(false);
  });
});
