import { Request, Response } from 'express';
import * as fileService from '../services/file.service';

export const getFiles = (req: Request, res: Response) => {
  res.json(fileService.getFiles());
};

export const createFile = (req: Request, res: Response) => {
  try {
    const file = fileService.createFile(req.body);
    res.status(201).json(file);
  } catch (e: any) {
    res.status(400).json({ error: 'File creation failed', details: e?.message || String(e) });
  }
};

export const updateFile = (req: Request, res: Response) => {
  try {
    const file = fileService.updateFile(req.params.id, req.body);
    if (file) return res.json(file);
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'File update failed', details: e?.message || String(e) });
  }
};

export const deleteFile = (req: Request, res: Response) => {
  try {
    const ok = fileService.deleteFile(req.params.id);
    if (ok) return res.status(204).end();
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'File deletion failed', details: e?.message || String(e) });
  }
};
