import { Request, Response } from 'express';
import * as todoService from '../services/todo.service';

export const getTodos = (req: Request, res: Response) => {
  res.json(todoService.getTodos());
};

export const createTodo = (req: Request, res: Response) => {
  try {
    const todo = todoService.createTodo(req.body);
    res.status(201).json(todo);
  } catch (e: any) {
    res.status(400).json({ error: 'Todo creation failed', details: e?.message || String(e) });
  }
};

export const updateTodo = (req: Request, res: Response) => {
  try {
    const todo = todoService.updateTodo(req.params.id, req.body);
    if (todo) return res.json(todo);
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'Todo update failed', details: e?.message || String(e) });
  }
};

export const deleteTodo = (req: Request, res: Response) => {
  try {
    const ok = todoService.deleteTodo(req.params.id);
    if (ok) return res.status(204).end();
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'Todo deletion failed', details: e?.message || String(e) });
  }
};
