import { Request, Response } from 'express';
import * as historyService from '../services/history.service';
import logger from '../logger';

export const getHistories = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;
    const histories = await historyService.getHistories(
      typeof projectId === 'string' ? projectId : undefined,
    );

    logger.info('Fetched histories', histories);
    res.json(histories);
  } catch (e: any) {
    logger.error('Failed to fetch histories: %s', e?.message || e);
    res.status(500).json({ error: 'Failed to fetch histories', details: e?.message || String(e) });
  }
};

export const createHistory = async (req: Request, res: Response) => {
  try {
    const history = await historyService.createHistory(req.body);
    logger.info('Created history: %o', history);
    res.status(201).json(history);
  } catch (e: any) {
    logger.error('History creation failed: %s', e?.message || e);
    res.status(400).json({ error: 'History creation failed', details: e?.message || String(e) });
  }
};

export const updateHistory = async (req: Request, res: Response) => {
  try {
    const history = await historyService.updateHistory(req.params.id, req.body);
    if (history) {
      logger.info('Updated history: %o', history);
      return res.json(history);
    }
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    logger.error('History update failed: %s', e?.message || e);
    res.status(400).json({ error: 'History update failed', details: e?.message || String(e) });
  }
};

export const deleteHistory = async (req: Request, res: Response) => {
  try {
    const ok = await historyService.deleteHistory(req.params.id);
    if (ok) {
      logger.info('Deleted history: %s', req.params.id);
      return res.status(204).end();
    }
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    logger.error('History deletion failed: %s', e?.message || e);
    res.status(400).json({ error: 'History deletion failed', details: e?.message || String(e) });
  }
};
