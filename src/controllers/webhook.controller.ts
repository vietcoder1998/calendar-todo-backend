import { Request, Response } from 'express';
import * as webhookService from '../services/webhook.service';

export const getWebhooks = (req: Request, res: Response) => {
  res.json(webhookService.getWebhooks());
};

export const createWebhook = (req: Request, res: Response) => {
  try {
    const webhook = webhookService.createWebhook(req.body);
    res.status(201).json(webhook);
  } catch (e: any) {
    res.status(400).json({ error: 'Webhook creation failed', details: e?.message || String(e) });
  }
};

export const updateWebhook = (req: Request, res: Response) => {
  try {
    const webhook = webhookService.updateWebhook(req.params.id, req.body);
    if (webhook) return res.json(webhook);
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'Webhook update failed', details: e?.message || String(e) });
  }
};

export const deleteWebhook = (req: Request, res: Response) => {
  try {
    const ok = webhookService.deleteWebhook(req.params.id);
    if (ok) return res.status(204).end();
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'Webhook deletion failed', details: e?.message || String(e) });
  }
};
