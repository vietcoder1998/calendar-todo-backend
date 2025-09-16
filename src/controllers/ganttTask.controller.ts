import { Request, Response } from 'express';
import * as ganttTaskService from '../services/ganttTask.service';

export const getGanttTasks = (req: Request, res: Response) => {
  res.json(ganttTaskService.getGanttTasks());
};

export const createGanttTask = (req: Request, res: Response) => {
  try {
    const task = ganttTaskService.createGanttTask(req.body);
    res.status(201).json(task);
  } catch (e: any) {
    res.status(400).json({ error: 'GanttTask creation failed', details: e?.message || String(e) });
  }
};

export const updateGanttTask = (req: Request, res: Response) => {
  try {
    const task = ganttTaskService.updateGanttTask(req.params.id, req.body);
    if (task) return res.json(task);
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'GanttTask update failed', details: e?.message || String(e) });
  }
};

export const deleteGanttTask = (req: Request, res: Response) => {
  try {
    const ok = ganttTaskService.deleteGanttTask(req.params.id);
    if (ok) return res.status(204).end();
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'GanttTask deletion failed', details: e?.message || String(e) });
  }
};
