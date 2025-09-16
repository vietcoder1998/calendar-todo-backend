import { describe, it, expect, beforeEach, beforeAll, afterAll } from '@jest/globals';
import * as ganttTaskService from './ganttTask.service';
import { PrismaClient } from '@prisma/client';
import { GanttTask } from '../types';

const prisma = new PrismaClient();

const baseTask = {
  id: '1',
  name: 'Task 1',
  start: null,
  end: null,
  createdAt: null,
  updatedAt: null,
  projectId: 'test-project',
} as Required<GanttTask>;

describe('ganttTask.service', () => {
  beforeAll(async () => {
    await prisma.project.upsert({
      where: { id: 'test-project' },
      update: {},
      create: { id: 'test-project', name: 'Test Project' },
    });
  });

  beforeEach(async () => {
    // Clean up the test gantt task before each test to avoid unique constraint errors
    await prisma.ganttTask.deleteMany({ where: { id: baseTask.id } });
  });

  afterAll(async () => {
    await prisma.ganttTask.deleteMany({ where: { projectId: 'test-project' } });
    await prisma.project.delete({ where: { id: 'test-project' } });
    await prisma.$disconnect();
  });

  it('should create a gantt task', async () => {
    const created = await ganttTaskService.createGanttTask(baseTask);
    expect(created).toMatchObject(baseTask);
    const tasks = await ganttTaskService.getGanttTasks('test-project');
    expect(tasks.find((t) => t.id === baseTask.id)).toBeTruthy();
  });

  it('should update a gantt task', async () => {
    await ganttTaskService.createGanttTask(baseTask);
    const updated = await ganttTaskService.updateGanttTask('1', { name: 'Updated Task' });
    expect(updated).toMatchObject({ id: '1', name: 'Updated Task' });
  });

  it('should delete a gantt task', async () => {
    await ganttTaskService.createGanttTask(baseTask);
    const deleted = await ganttTaskService.deleteGanttTask('1');
    expect(deleted).toBe(true);
    const tasks = await ganttTaskService.getGanttTasks('test-project');
    expect(tasks.find((t) => t.id === baseTask.id)).toBeFalsy();
  });

  it('should return null when updating non-existent gantt task', async () => {
    const updated = await ganttTaskService.updateGanttTask('not-exist', { name: 'fail' });
    expect(updated).toBeNull();
  });

  it('should return false when deleting non-existent gantt task', async () => {
    const deleted = await ganttTaskService.deleteGanttTask('not-exist');
    expect(deleted).toBe(false);
  });
});
