import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import * as historyService from './history.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('history.service (Prisma)', () => {
  let project: any;

  beforeAll(async () => {
    // Create a minimal project for relation
    project = await prisma.project.create({
      data: {
        id: 'test-project',
        name: 'Test Project',
        status: 1,
      },
    });
  });

  afterAll(async () => {
    // Delete all related records first
    await prisma.history.deleteMany({ where: { projectId: project.id } });
    await prisma.permission.deleteMany({ where: { projectId: project.id } });
    await prisma.user.deleteMany({ where: { projectId: project.id } });
    await prisma.fileItem.deleteMany({ where: { projectId: project.id } });
    await prisma.linkedItem.deleteMany({ where: { projectId: project.id } });
    await prisma.ganttTask.deleteMany({ where: { projectId: project.id } });
    await prisma.webhook.deleteMany({ where: { projectId: project.id } });
    await prisma.location.deleteMany({ where: { projectId: project.id } });
    // Now you can safely delete the project
    await prisma.project.delete({ where: { id: project.id } });
    await prisma.$disconnect();
  });

  function getValidHistory(overrides = {}) {
    return {
      id: 'test-history',
      action: 'create',
      date: new Date(),
      type: 'test',
      timestamp: new Date().toISOString(),
      projectId: project.id,
      ...overrides,
    };
  }

  it('should create a history', async () => {
    const history = getValidHistory();
    const created = await historyService.createHistory(history);
    expect(created).toMatchObject({
      id: history.id,
      action: history.action,
      type: history.type,
      projectId: project.id,
    });
    const all = await historyService.getHistories();
    expect(all.map((h) => h.id)).toContain(history.id);
  });

  it('should update a history', async () => {
    const history = getValidHistory({ id: 'update-history', action: 'create' });
    await historyService.createHistory(history);
    const updated = await historyService.updateHistory('update-history', { action: 'update' });
    expect(updated).toMatchObject({ id: 'update-history', action: 'update' });
  });

  it('should delete a history', async () => {
    const history = getValidHistory({ id: 'delete-history' });
    await historyService.createHistory(history);
    const deleted = await historyService.deleteHistory('delete-history');
    expect(deleted).toBe(true);
    const all = await historyService.getHistories();
    expect(all.find((h) => h.id === 'delete-history')).toBeUndefined();
  });

  it('should return null when updating non-existent history', async () => {
    const updated = await historyService.updateHistory('not-exist', { action: 'fail' });
    expect(updated).toBeNull();
  });

  it('should return false when deleting non-existent history', async () => {
    const deleted = await historyService.deleteHistory('not-exist');
    expect(deleted).toBe(false);
  });
});
