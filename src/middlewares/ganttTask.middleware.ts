import { Request, Response, NextFunction } from 'express';

export const validateGanttTask = (req: Request, res: Response, next: NextFunction) => {
  const { id, color, startDate, endDate, name } = req.body;

  // Require id for non-POST methods only
  if (req.method !== 'POST') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'GanttTask id is required and must be a string.' });
    }
  }

  // Always require color, startDate, endDate, name
  if (!color || typeof color !== 'string') {
    return res.status(400).json({ error: 'GanttTask color is required and must be a string.' });
  }
  if (!startDate || (typeof startDate !== 'string' && typeof startDate !== 'number')) {
    return res
      .status(400)
      .json({ error: 'GanttTask startDate is required and must be a string or number.' });
  }
  if (!endDate || (typeof endDate !== 'string' && typeof endDate !== 'number')) {
    return res
      .status(400)
      .json({ error: 'GanttTask endDate is required and must be a string or number.' });
  }
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'GanttTask name is required and must be a string.' });
  }

  next();
};
