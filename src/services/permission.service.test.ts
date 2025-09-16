import { describe, it, expect, beforeEach } from '@jest/globals';
import * as permissionService from './permission.service';

describe('permission.service', () => {
  beforeEach(() => {
    // @ts-ignore
    permissionService['permissions'] = [];
  });

  it('should create a permission', () => {
    const permission = { id: '1', type: 'view' };
    const created = permissionService.createPermission(permission);
    expect(created).toEqual(permission);
    expect(permissionService.getPermissions()).toContainEqual(permission);
  });

  it('should update a permission', () => {
    const permission = { id: '1', type: 'view' };
    permissionService.createPermission(permission);
    const updated = permissionService.updatePermission('1', { type: 'edit' });
    expect(updated).toMatchObject({ id: '1', type: 'edit' });
  });

  it('should delete a permission', () => {
    const permission = { id: '1', type: 'view' };
    permissionService.createPermission(permission);
    const deleted = permissionService.deletePermission('1');
    expect(deleted).toBe(true);
    expect(permissionService.getPermissions()).toHaveLength(0);
  });

  it('should return null when updating non-existent permission', () => {
    const updated = permissionService.updatePermission('not-exist', { type: 'fail' });
    expect(updated).toBeNull();
  });

  it('should return false when deleting non-existent permission', () => {
    const deleted = permissionService.deletePermission('not-exist');
    expect(deleted).toBe(false);
  });
});
