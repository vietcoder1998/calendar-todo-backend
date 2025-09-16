import { Request, Response } from 'express';
import * as todoService from '../services/todo.service';
import logger from '../logger';

export const getTodos = (req: Request, res: Response) => {
  try {
    const todos = todoService.getTodos();
    logger.info('Fetched todos');
    res.json(todos);
  } catch (e: any) {
    logger.error('Failed to fetch todos: %s', e?.message || e);
    res.status(500).json({ error: 'Failed to fetch todos', details: e?.message || String(e) });
  }
};

export const createTodo = (req: Request, res: Response) => {
  try {
    const todo = todoService.createTodo(req.body);
    logger.info('Created todo: %o', todo);
    res.status(201).json(todo);
  } catch (e: any) {
    logger.error('Todo creation failed: %s', e?.message || e);
    res.status(400).json({ error: 'Todo creation failed', details: e?.message || String(e) });
  }
};

export const updateTodo = (req: Request, res: Response) => {
  try {
    const todo = todoService.updateTodo(req.params.id, req.body);
    if (todo) {
      logger.info('Updated todo: %o', todo);
      return res.json(todo);
    }
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    logger.error('Todo update failed: %s', e?.message || e);
    res.status(400).json({ error: 'Todo update failed', details: e?.message || String(e) });
  }
};

export const deleteTodo = (req: Request, res: Response) => {
  try {
    const ok = todoService.deleteTodo(req.params.id);
    if (ok) {
      logger.info('Deleted todo: %s', req.params.id);
      return res.status(204).end();
    }
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    logger.error('Todo deletion failed: %s', e?.message || e);
    res.status(400).json({ error: 'Todo deletion failed', details: e?.message || String(e) });
  }
};
