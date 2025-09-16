import { Request, Response } from 'express';
import * as permissionService from '../services/permission.service';

export const getPermissions = (req: Request, res: Response) => {
  res.json(permissionService.getPermissions());
};

export const createPermission = (req: Request, res: Response) => {
  try {
    const permission = permissionService.createPermission(req.body);
    res.status(201).json(permission);
  } catch (e: any) {
    res.status(400).json({ error: 'Permission creation failed', details: e?.message || String(e) });
  }
};

export const updatePermission = (req: Request, res: Response) => {
  try {
    const permission = permissionService.updatePermission(req.params.id, req.body);
    if (permission) return res.json(permission);
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'Permission update failed', details: e?.message || String(e) });
  }
};

export const deletePermission = (req: Request, res: Response) => {
  try {
    const ok = permissionService.deletePermission(req.params.id);
    if (ok) return res.status(204).end();
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'Permission deletion failed', details: e?.message || String(e) });
  }
};
