import { Request, Response } from 'express';
import * as labelService from '../services/label.service';
export async function getLabelsByProjectId(req: Request, res: Response) {
  const { projectId } = req.params;
  if (!projectId) return res.status(400).json({ error: 'Missing projectId' });
  try {
    const labels = await labelService.getLabelsByProjectId(projectId);
    res.json(labels);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch labels' });
  }
}
