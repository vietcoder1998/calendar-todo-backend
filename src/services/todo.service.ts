import { PrismaClient, Todo as PrismaTodo } from '@prisma/client';
import type { Todo } from '../types';

const prisma = new PrismaClient();

// Utility: Convert app Todo type to Prisma create/update input
function toPrismaTodoInput(todo: Omit<Todo, 'id'> & { id?: string }): any {
  return {
    ...todo,
    // Arrays/objects to JSON or undefined as per schema
    relatedTaskIds: todo.relatedTaskIds ? JSON.stringify(todo.relatedTaskIds) : undefined,
    linkedItems: todo.linkedItems ? JSON.stringify(todo.linkedItems) : undefined,
    assignedUsers: todo.assignedUsers ? JSON.stringify(todo.assignedUsers) : undefined,
    files: todo.files ? JSON.stringify(todo.files) : undefined,
    webhooks: todo.webhooks ? JSON.stringify(todo.webhooks) : undefined,
    ganttTaskIds: todo.ganttTaskIds ? JSON.stringify(todo.ganttTaskIds) : undefined,
    history: todo.history ? JSON.stringify(todo.history) : undefined,
  };
}

// Utility: Convert Prisma Todo to app Todo type
function fromPrismaTodo(prismaTodo: PrismaTodo): Todo {
  return {
    ...prismaTodo,
    status: prismaTodo.status as 'todo' | 'in-progress' | 'review' | 'done',
    relatedTaskIds: prismaTodo.relatedTaskIds ? JSON.parse(prismaTodo.relatedTaskIds as any) : [],
    linkedItems: prismaTodo.linkedItems ? JSON.parse(prismaTodo.linkedItems as any) : [],
    assignedUsers: prismaTodo.assignedUsers ? JSON.parse(prismaTodo.assignedUsers as any) : [],
    files: prismaTodo.files ? JSON.parse(prismaTodo.files as any) : [],
    webhooks: prismaTodo.webhooks ? JSON.parse(prismaTodo.webhooks as any) : [],
    ganttTaskIds: prismaTodo.ganttTaskIds ? JSON.parse(prismaTodo.ganttTaskIds as any) : [],
    history: prismaTodo.history ? JSON.parse(prismaTodo.history as any) : [],
    deadline: prismaTodo.deadline === null ? undefined : prismaTodo.deadline,
    locationId: prismaTodo.locationId === null ? undefined : prismaTodo.locationId,
  };
}

export async function getTodos(projectId?: string): Promise<Todo[]> {
  if (projectId) {
    const todos = await prisma.todo.findMany({ where: { projectId } });
    return todos.map(fromPrismaTodo);
  }
  const todos = await prisma.todo.findMany();
  return todos.map(fromPrismaTodo);
}

export async function createTodo(todo: Omit<Todo, 'id'> & { id?: string }): Promise<Todo> {
  const { projectId, ...rest } = toPrismaTodoInput(todo);
  const created = await prisma.todo.create({
    data: {
      ...rest,
      project: { connect: { id: todo.projectId } },
      createdAt: rest.createdAt || new Date().toISOString(),
      updatedAt: rest.updatedAt || new Date().toISOString(),
    },
  });

  return fromPrismaTodo(created);
}

export async function updateTodo(id: string, updates: Partial<Todo>): Promise<Todo | null> {
  try {
    const updated = await prisma.todo.update({
      where: { id },
      data: toPrismaTodoInput(updates as any),
    });
    return fromPrismaTodo(updated);
  } catch {
    return null;
  }
}

export async function deleteTodo(id: string): Promise<boolean> {
  try {
    await prisma.todo.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function getTodoDetail(id: string): Promise<Todo | null> {
  const todo = await prisma.todo.findUnique({ where: { id } });
  return todo ? fromPrismaTodo(todo) : null;
}
