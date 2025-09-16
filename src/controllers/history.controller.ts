import { Request, Response } from 'express';
import * as historyService from '../services/history.service';

export const getHistories = (req: Request, res: Response) => {
  res.json(historyService.getHistories());
};

export const createHistory = (req: Request, res: Response) => {
  try {
    const history = historyService.createHistory(req.body);
    res.status(201).json(history);
  } catch (e: any) {
    res.status(400).json({ error: 'History creation failed', details: e?.message || String(e) });
  }
};

export const updateHistory = (req: Request, res: Response) => {
  try {
    const history = historyService.updateHistory(req.params.id, req.body);
    if (history) return res.json(history);
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'History update failed', details: e?.message || String(e) });
  }
};

export const deleteHistory = (req: Request, res: Response) => {
  try {
    const ok = historyService.deleteHistory(req.params.id);
    if (ok) return res.status(204).end();
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'History deletion failed', details: e?.message || String(e) });
  }
};
