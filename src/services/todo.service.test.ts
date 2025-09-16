import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import * as todoService from './todo.service';
import { PrismaClient } from '@prisma/client';

const baseTodo = {
  id: 'test-id',
  title: 'Test Todo',
  description: '',
  date: '2025-09-16',
  status: 'todo' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  projectId: 'project-1',
};

const prisma = new PrismaClient();

const testProject = {
  id: 'project-1',
  name: 'Test Project',
  description: 'Test',
  avatarUrl: null,
  plan: null,
  members: null,
};

describe('todo.service (prisma)', () => {
  // Clean up the test todo if it exists
  afterEach(async () => {
    await todoService.deleteTodo('test-id');
    await todoService.deleteTodo('not-exist');
  });

  beforeAll(async () => {
    // Ensure the test project exists
    await prisma.project.upsert({
      where: { id: testProject.id },
      update: {},
      create: testProject,
    });
  });

  afterAll(async () => {
    // Clean up the test project
    await prisma.todo.deleteMany({ where: { projectId: testProject.id } });
    await prisma.project.delete({ where: { id: testProject.id } });
    await prisma.$disconnect();
  });

  it('should create a todo', async () => {
    const created = await todoService.createTodo(baseTodo);
    expect(created).toMatchObject(baseTodo);
    const todos = await todoService.getTodos();
    expect(todos.find((t) => t.id === baseTodo.id)).toBeTruthy();
  });

  it('should update a todo', async () => {
    await todoService.createTodo(baseTodo);
    const updated = await todoService.updateTodo('test-id', { title: 'Updated Todo' });
    expect(updated).toMatchObject({ id: 'test-id', title: 'Updated Todo' });
  });

  it('should delete a todo', async () => {
    await todoService.createTodo(baseTodo);
    const deleted = await todoService.deleteTodo('test-id');
    expect(deleted).toBe(true);
    const todos = await todoService.getTodos();
    expect(todos.find((t) => t.id === baseTodo.id)).toBeFalsy();
  });

  it('should return null when updating non-existent todo', async () => {
    const updated = await todoService.updateTodo('not-exist', { title: 'fail' });
    expect(updated).toBeNull();
  });

  it('should return false when deleting non-existent todo', async () => {
    const deleted = await todoService.deleteTodo('not-exist');
    expect(deleted).toBe(false);
  });
});
