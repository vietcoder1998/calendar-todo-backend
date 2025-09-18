import { GanttTask as GanttTaskType } from '../types';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { createAsset } from './asset.util';
const prisma = new PrismaClient();

const fromPrismaGanttTask = (prismaTask: any): GanttTaskType => ({
  id: prismaTask.id,
  name: prismaTask.name ?? null,
  start: prismaTask.start ?? null,
  end: prismaTask.end ?? null,
  createdAt: prismaTask.createdAt
    ? (prismaTask.createdAt.toISOString?.() ?? prismaTask.createdAt)
    : null,
  updatedAt: prismaTask.updatedAt
    ? (prismaTask.updatedAt.toISOString?.() ?? prismaTask.updatedAt)
    : null,
  startDate: prismaTask.startDate ?? null,
  endDate: prismaTask.endDate ?? null,
  color: prismaTask.color ?? null,
  projectId: prismaTask.projectId,
  assetId: prismaTask.assetId ?? null,
});

// Get only Gantt tasks by projectId
export const getOnlyGanttTasksByProjectId = async (projectId: string) => {
  const tasks = await prisma.ganttTask.findMany({ where: { projectId } });
  return tasks.map(fromPrismaGanttTask);
};

export const getGanttTasks = async (projectId?: string) => {
  if (projectId) {
    const tasks = await prisma.ganttTask.findMany({ where: { projectId } });
    return tasks.map(fromPrismaGanttTask);
  }
  const tasks = await prisma.ganttTask.findMany();
  return tasks.map(fromPrismaGanttTask);
};

export const getGanttTaskById = async (id: string) => {
  const task = await prisma.ganttTask.findUnique({ where: { id } });
  return task ? fromPrismaGanttTask(task) : null;
};

export const createGanttTask = async (
  task: GanttTaskType & { color?: string; startDate?: string; endDate?: string },
) => {
  const { projectId, color, startDate, endDate, ...rest } = task as any;

  // Check if project exists
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new Error('Project not found');
  }

  // Create asset and link
  let assetId: string | null = null;
  if (task.name) {
    assetId = await createAsset(task.name, 'ganttTask');
  }

  const data = {
    ...rest,
    id: randomUUID(),
    start: startDate ?? rest.start,
    end: endDate ?? rest.end,
    startDate: startDate ?? rest.start,
    endDate: endDate ?? rest.end,
    color: color || 'bg-blue-500',
    assetId,
    projectId,
  };
  const created = await prisma.ganttTask.create({ data });
  return fromPrismaGanttTask(created);
};

export const updateGanttTask = async (id: string, updates: Partial<GanttTaskType>) => {
  try {
    const updated = await prisma.ganttTask.update({ where: { id }, data: updates });
    return fromPrismaGanttTask(updated);
  } catch {
    return null;
  }
};

export const deleteGanttTask = async (id: string) => {
  try {
    await prisma.ganttTask.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
};
