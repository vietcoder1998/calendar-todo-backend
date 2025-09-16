export const getTodos = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;
    const todos = await todoService.getTodos(typeof projectId === 'string' ? projectId : undefined);
    logger.info('Fetched todos');
    res.json(todos);
  } catch (e: any) {
    logger.error('Failed to fetch todos: %s', e?.message || e);
    res.status(500).json({ error: 'Failed to fetch todos', details: e?.message || String(e) });
  }
};
import { Request, Response } from 'express';

import * as todoService from '../services/todo.service';
import logger from '../logger';
import { Todo } from '../types/index';

export const createTodo = async (req: Request, res: Response) => {
  try {
    // Ensure typing and required fields for Todo
    const {
      id,
      title,
      description,
      date,
      status,
      createdAt,
      updatedAt,
      projectId,
      linkedItems,
      assignedUsers,
      files,
      webhooks,
      ganttTaskIds,
      relatedTaskIds,
      history,
      locationId,
    } = req.body;
    if (!id || !title || !date || !status || !createdAt || !updatedAt || !projectId) {
      return res.status(400).json({ error: 'Missing required todo fields' });
    }
    // Ensure relationships are arrays of strings if present
    const todo: Todo = {
      id,
      title,
      description,
      date,
      status,
      createdAt,
      updatedAt,
      projectId,
      locationId,
      history,
      linkedItems: Array.isArray(linkedItems) ? linkedItems.map(String) : [],
      assignedUsers: Array.isArray(assignedUsers) ? assignedUsers.map(String) : [],
      files: Array.isArray(files) ? files.map(String) : [],
      webhooks: Array.isArray(webhooks) ? webhooks.map(String) : [],
      ganttTaskIds: Array.isArray(ganttTaskIds) ? ganttTaskIds.map(String) : [],
      relatedTaskIds: Array.isArray(relatedTaskIds) ? relatedTaskIds.map(String) : [],
    };
    const created = await todoService.createTodo(todo);
    logger.info('Created todo: %o', created);
    res.status(201).json(created);
  } catch (e: any) {
    logger.error('Todo creation failed: %s', e?.message || e);
    res.status(400).json({ error: 'Todo creation failed', details: e?.message || String(e) });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const todo = await todoService.updateTodo(req.params.id, req.body);
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

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const ok = await todoService.deleteTodo(req.params.id);
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
