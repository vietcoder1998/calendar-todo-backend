import { Request, Response } from 'express';
import * as historyService from '../services/history.service';
import logger from '../logger';

export const getHistories = (req: Request, res: Response) => {
  try {
    const histories = historyService.getHistories();
    logger.info('Fetched histories');
    res.json(histories);
  } catch (e: any) {
    logger.error('Failed to fetch histories: %s', e?.message || e);
    res.status(500).json({ error: 'Failed to fetch histories', details: e?.message || String(e) });
  }
};

export const createHistory = (req: Request, res: Response) => {
  try {
    const history = historyService.createHistory(req.body);
    logger.info('Created history: %o', history);
    res.status(201).json(history);
  } catch (e: any) {
    logger.error('History creation failed: %s', e?.message || e);
    res.status(400).json({ error: 'History creation failed', details: e?.message || String(e) });
  }
};

export const updateHistory = (req: Request, res: Response) => {
  try {
    const history = historyService.updateHistory(req.params.id, req.body);
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

export const deleteHistory = (req: Request, res: Response) => {
  try {
    const ok = historyService.deleteHistory(req.params.id);
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
