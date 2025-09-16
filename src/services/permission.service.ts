type Permission = { id: string; [key: string]: unknown };
let permissions: Permission[] = [];

export const getPermissions = () => permissions;
export const createPermission = (permission: Permission) => {
  permissions.push(permission);
  return permission;
};
export const updatePermission = (id: string, updates: Partial<Permission>) => {
  const idx = permissions.findIndex((p) => p.id === id);
  if (idx !== -1) {
    permissions[idx] = { ...permissions[idx], ...updates };
    return permissions[idx];
  }
  return null;
};
export const deletePermission = (id: string) => {
  const prevLen = permissions.length;
  permissions = permissions.filter((p) => p.id !== id);
  return permissions.length < prevLen;
};
