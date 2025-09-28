import { PrismaClient } from '@prisma/client';
import type { Todo } from '@/types';
import { createAsset } from './asset.util';
import logger from '../logger';

const prisma = new PrismaClient();

// Utility: Convert app Todo type to Prisma create/update input
const toPrismaTodoInput = (todo: Omit<Todo, 'id'> & { id?: string }): any => ({
  ...todo,
  relatedTaskIds: todo.relatedTaskIds ? JSON.stringify(todo.relatedTaskIds) : undefined,
  linkedItems: todo.linkedItems ? JSON.stringify(todo.linkedItems) : undefined,
  assignedUsers: todo.assignedUsers ? JSON.stringify(todo.assignedUsers) : undefined,
  files: todo.files ? JSON.stringify(todo.files) : undefined,
  webhooks: todo.webhooks ? JSON.stringify(todo.webhooks) : undefined,
  ganttTaskIds: todo.ganttTaskIds ? JSON.stringify(todo.ganttTaskIds) : undefined,
  history: todo.history ? JSON.stringify(todo.history) : undefined,
  startDate: todo.startDate ?? null,
  endDate: todo.endDate ?? null,
  status: todo.status ?? null,
  label: todo.label ?? null,
});

// Utility: Convert Prisma Todo to app Todo type
const fromPrismaTodo = (prismaTodo: any): Todo => ({
  ...prismaTodo,
  label: prismaTodo.label as 'todo' | 'in-progress' | 'review' | 'done',
  relatedTaskIds: prismaTodo.relatedTaskIds ? JSON.parse(prismaTodo.relatedTaskIds as any) : [],
  linkedItems: prismaTodo.linkedItems ? JSON.parse(prismaTodo.linkedItems as any) : [],
  assignedUsers: prismaTodo.assignedUsers ? JSON.parse(prismaTodo.assignedUsers as any) : [],
  files: prismaTodo.files ? JSON.parse(prismaTodo.files as any) : [],
  webhooks: prismaTodo.webhooks ? JSON.parse(prismaTodo.webhooks as any) : [],
  ganttTaskIds: prismaTodo.ganttTaskIds ? JSON.parse(prismaTodo.ganttTaskIds as any) : [],
  history: prismaTodo.history ? JSON.parse(prismaTodo.history as any) : [],
  deadline: prismaTodo.deadline ?? null,
  startDate: prismaTodo.startDate ?? null,
  endDate: prismaTodo.endDate ?? null,
  status: prismaTodo.status ?? 1,
});

export const getTodos = async (projectId?: string): Promise<Todo[]> => {
  if (projectId) {
    const todos = await prisma.todo.findMany({ where: { projectId } });
    return todos.map(fromPrismaTodo);
  }
  const todos = await prisma.todo.findMany();
  return todos.map(fromPrismaTodo);
};

export const createTodo = async (todo: Omit<Todo, 'id'> & { id?: string }): Promise<Todo> => {
  // Create asset and link
  let assetId: string | null = null;
  if (todo.title) {
    assetId = await createAsset(todo.title, 'todo');
  }
  // Convert status to int if string
  let status: number = 1;
  if (typeof todo.status === 'string') {
    switch (todo.status) {
      case 'todo':
        status = 1;
        break;
      case 'in-progress':
        status = 2;
        break;
      case 'review':
        status = 3;
        break;
      case 'done':
        status = 4;
        break;
      default:
        status = 1;
    }
  } else if (typeof todo.status === 'number') {
    status = todo.status;
  }
  // Prisma expects relation connects, not direct ids
  const { projectId, assetId: _assetId, ...rest } = toPrismaTodoInput(todo);
  let position = todo.position;
  if (position == null && todo.projectId) {
    const max = await prisma.todo.aggregate({
      where: { projectId: todo.projectId },
      _max: { position: true },
    });
    position = (max._max?.position ?? 0) + 1;
  }
  const created = await prisma.todo.create({
    data: {
      ...rest,
      status,
      label: todo.label || 'todo',
      createdAt: rest.createdAt || new Date().toISOString(),
      updatedAt: rest.updatedAt || new Date().toISOString(),
      project: { connect: { id: todo.projectId } },
      ...(assetId ? { asset: { connect: { id: assetId } } } : {}),
      position,
    },
  });
  return fromPrismaTodo(created);
};

export const updateTodo = async (id: string, updates: Partial<Todo>): Promise<Todo | null> => {
  try {
    // Build update data, only include defined fields
    const updateData: any = {};
    for (const key in updates) {
      const value = (updates as any)[key];
      if (value !== undefined) {
        if (key === 'projectId') {
          updateData['project'] = { connect: { id: value } };
        } else {
          updateData[key] = value;
        }
      }
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: updateData,
    });
    return fromPrismaTodo(updated);
  } catch (err) {
    logger.error(
      'Failed to update todo: %s',
      typeof err === 'object' && err !== null && 'message' in err
        ? (err as any).message
        : JSON.stringify(err),
    );
    return null;
  }
};

export const deleteTodo = async (id: string): Promise<boolean> => {
  try {
    await prisma.todo.delete({ where: { id } });
    return true;
  } catch (err) {
    logger.error(
      'Failed to delete todo: %s',
      typeof err === 'object' && err !== null && 'message' in err
        ? (err as any).message
        : JSON.stringify(err),
    );
    return false;
  }
};

export const getTodoDetail = async (id: string): Promise<Todo | null> => {
  const todo = await prisma.todo.findUnique({ where: { id } });
  return todo ? fromPrismaTodo(todo) : null;
};

export const swapTodoPosition = async (id1: string, id2: string): Promise<void> => {
  const todo1 = await prisma.todo.findUnique({ where: { id: id1 } });
  const todo2 = await prisma.todo.findUnique({ where: { id: id2 } });
  if (!todo1 || !todo2) throw new Error('Todo not found');
  await prisma.todo.update({ where: { id: id1 }, data: { position: todo2.position } });
  await prisma.todo.update({ where: { id: id2 }, data: { position: todo1.position } });
};
