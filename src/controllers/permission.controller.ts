import { Request, Response } from 'express';
import * as permissionService from '../services/permission.service';
import logger from '../logger';

export const getPermissions = (req: Request, res: Response) => {
  try {
    const permissions = permissionService.getPermissions();
    logger.info('Fetched permissions');
    res.json(permissions);
  } catch (e: any) {
    logger.error('Failed to fetch permissions: %s', e?.message || e);
    res
      .status(500)
      .json({ error: 'Failed to fetch permissions', details: e?.message || String(e) });
  }
};

export const createPermission = (req: Request, res: Response) => {
  try {
    const permission = permissionService.createPermission(req.body);
    logger.info('Created permission: %o', permission);
    res.status(201).json(permission);
  } catch (e: any) {
    logger.error('Permission creation failed: %s', e?.message || e);
    res.status(400).json({ error: 'Permission creation failed', details: e?.message || String(e) });
  }
};

export const updatePermission = (req: Request, res: Response) => {
  try {
    const permission = permissionService.updatePermission(req.params.id, req.body);
    if (permission) {
      logger.info('Updated permission: %o', permission);
      return res.json(permission);
    }
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    logger.error('Permission update failed: %s', e?.message || e);
    res.status(400).json({ error: 'Permission update failed', details: e?.message || String(e) });
  }
};

export const deletePermission = (req: Request, res: Response) => {
  try {
    const ok = permissionService.deletePermission(req.params.id);
    if (ok) {
      logger.info('Deleted permission: %s', req.params.id);
      return res.status(204).end();
    }
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    logger.error('Permission deletion failed: %s', e?.message || e);
    res.status(400).json({ error: 'Permission deletion failed', details: e?.message || String(e) });
  }
};
