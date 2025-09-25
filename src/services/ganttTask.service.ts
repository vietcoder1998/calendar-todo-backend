import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { GanttTask as GanttTaskType } from '../types';
import { createAsset } from './asset.util';
const prisma = new PrismaClient();

const fromPrismaGanttTask = (prismaTask: any): GanttTaskType => ({
  id: prismaTask.id,
  name: prismaTask.name ?? null,
  startDate: prismaTask.startDate ?? null,
  endDate: prismaTask.endDate ?? null,
  color: prismaTask.color ?? null,
  projectId: prismaTask.projectId,
  assetId: prismaTask.assetId ?? null,
  createdAt: prismaTask.createdAt,
  updatedAt: prismaTask.createdAt,
  position: prismaTask.position ?? 0,
});

// Get only Gantt tasks by projectId
export const getOnlyGanttTasksByProjectId = async (projectId: string) => {
  const tasks = await prisma.ganttTask.findMany({
    where: { projectId },
    orderBy: { position: 'asc' },
  });
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

export const createGanttTask = async (task: GanttTaskType) => {
  const { projectId, color, ...rest } = task as GanttTaskType;

  // Check if project exists
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new Error('Project not found');
  }

  // Auto-increment position for this project
  const maxPositionResult = (await prisma.ganttTask.aggregate({
    where: { projectId },
    _max: { position: true } as any,
  })) as any;
  const nextPosition =
    (maxPositionResult._max && maxPositionResult._max.position
      ? maxPositionResult._max.position
      : 0) + 1;

  // Create asset and link
  let assetId: string | null = null;
  if (task.name) {
    assetId = await createAsset(task.name, 'ganttTask');
  }

  const data = {
    ...rest,
    id: randomUUID(),
    startDate: rest.startDate,
    endDate: rest.endDate,
    color: color || 'bg-blue-500',
    assetId,
    projectId,
    position: nextPosition,
  };
  const created = await prisma.ganttTask.create({ data });
  return fromPrismaGanttTask(created);
};

export const updateGanttTask = async (id: string, updates: Partial<GanttTaskType>) => {
  try {
    // Remove projectId if it's undefined to satisfy Prisma's type requirements
    const { projectId, assetId, ...rest } = updates;
    const data: any = projectId === undefined ? rest : { ...rest, projectId };

    // Only include assetId if it is not undefined
    if (assetId !== undefined) {
      data.assetId = assetId;
    }

    const updated = await prisma.ganttTask.update({ where: { id }, data });
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
