import { Request, Response } from 'express';
import * as fileService from '../services/file.service';
import logger from '../logger';

export const getFiles = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;
    const files = await fileService.getFiles(typeof projectId === 'string' ? projectId : undefined);
    logger.info('Fetched files');
    res.json(files);
  } catch (e: any) {
    logger.error('Failed to fetch files: %s', e?.message || e);
    res.status(500).json({ error: 'Failed to fetch files', details: e?.message || String(e) });
  }
};

export const createFile = async (req: Request, res: Response) => {
  try {
    const file = await fileService.createFile(req.body);
    logger.info('Created file: %o', file);
    res.status(201).json(file);
  } catch (e: any) {
    logger.error('File creation failed: %s', e?.message || e);
    res.status(400).json({ error: 'File creation failed', details: e?.message || String(e) });
  }
};

export const updateFile = async (req: Request, res: Response) => {
  try {
    const file = await fileService.updateFile(req.params.id, req.body);
    if (file) {
      logger.info('Updated file: %o', file);
      return res.json(file);
    }
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    logger.error('File update failed: %s', e?.message || e);
    res.status(400).json({ error: 'File update failed', details: e?.message || String(e) });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const ok = await fileService.deleteFile(req.params.id);
    if (ok) {
      logger.info('Deleted file: %s', req.params.id);
      return res.status(204).end();
    }
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    logger.error('File deletion failed: %s', e?.message || e);
    res.status(400).json({ error: 'File deletion failed', details: e?.message || String(e) });
  }
};
