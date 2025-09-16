import { Request, Response } from 'express';
import * as linkedItemService from '../services/linkedItem.service';

export const getLinkedItems = (req: Request, res: Response) => {
  res.json(linkedItemService.getLinkedItems());
};

export const createLinkedItem = (req: Request, res: Response) => {
  try {
    const item = linkedItemService.createLinkedItem(req.body);
    res.status(201).json(item);
  } catch (e: any) {
    res.status(400).json({ error: 'LinkedItem creation failed', details: e?.message || String(e) });
  }
};

export const updateLinkedItem = (req: Request, res: Response) => {
  try {
    const item = linkedItemService.updateLinkedItem(req.params.id, req.body);
    if (item) return res.json(item);
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'LinkedItem update failed', details: e?.message || String(e) });
  }
};

export const deleteLinkedItem = (req: Request, res: Response) => {
  try {
    const ok = linkedItemService.deleteLinkedItem(req.params.id);
    if (ok) return res.status(204).end();
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'LinkedItem deletion failed', details: e?.message || String(e) });
  }
};
