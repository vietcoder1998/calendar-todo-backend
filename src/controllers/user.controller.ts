import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import logger from '../logger';

export const getUsersByProjectId = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId: string = req.params.id;
    const q = req.query.q as string | undefined;
    logger.debug('Getting users for project: %s', projectId);
    let users = await userService.getUsersByProject(projectId);
    if (q) {
      const query = q.toLowerCase();
      users = users.filter(
        (u: any) =>
          (u.name && u.name.toLowerCase().includes(query)) ||
          (u.email && u.email.toLowerCase().includes(query)),
      );
    }
    logger.info('Fetched users for project: %s', projectId);
    res.json(users);
  } catch (e: any) {
    logger.error('Failed to fetch users for project: %s', e?.message || e);
    res
      .status(500)
      .json({ error: 'Failed to fetch users for project', details: e?.message || String(e) });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();
    logger.info('Fetched users');
    res.json(users);
  } catch (e: any) {
    logger.error('Failed to fetch users: %s', e?.message || e);
    res.status(500).json({ error: 'Failed to fetch users', details: e?.message || String(e) });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    logger.info('Created user: %o', user);
    res.status(201).json(user);
  } catch (e: any) {
    logger.error('User creation failed: %s', e?.message || e);
    res.status(400).json({ error: 'User creation failed', details: e?.message || String(e) });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const user = await userService.updateUser(id, req.body);
    logger.info('Updated user: %o', user);
    res.json(user);
  } catch (e: any) {
    logger.error('User update failed: %s', e?.message || e);
    res.status(404).json({ error: 'User not found', details: e?.message || String(e) });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await userService.deleteUser(id);
    logger.info('Deleted user: %d', id);
    res.status(204).end();
  } catch (e: any) {
    logger.error('User deletion failed: %s', e?.message || e);
    res.status(404).json({ error: 'User not found', details: e?.message || String(e) });
  }
};
