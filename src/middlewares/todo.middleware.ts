import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export const validateTodo = (req: Request, res: Response, next: NextFunction) => {
  let { id, title, date } = req.body;
  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res
        .status(400)
        .json({ error: 'Todo title is required and must be a non-empty string.' });
    }
  }
  if (!date || typeof date !== 'string' || !/\d{4}-\d{2}-\d{2}/.test(date)) {
    return res
      .status(400)
      .json({ error: 'Todo date is required and must be in YYYY-MM-DD format.' });
  }
  if (!id || typeof id !== 'string') {
    id = randomUUID();
    req.body.id = id;
  }
  next();
};
