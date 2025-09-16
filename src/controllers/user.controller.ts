import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const getUsers = async (req: Request, res: Response) => {
  const users = await userService.getUsers();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (e: any) {
    res.status(400).json({ error: 'User creation failed', details: e?.message || String(e) });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await userService.updateUser(id, req.body);
    res.json(user);
  } catch (e: any) {
    res.status(404).json({ error: 'User not found', details: e?.message || String(e) });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await userService.deleteUser(id);
    res.status(204).end();
  } catch (e: any) {
    res.status(404).json({ error: 'User not found', details: e?.message || String(e) });
  }
};
