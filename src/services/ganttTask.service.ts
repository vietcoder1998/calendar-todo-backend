import { PrismaClient, GanttTask as PrismaGanttTask } from '@prisma/client';
import { randomUUID } from 'crypto';
const prisma = new PrismaClient();

// Get only Gantt tasks by projectId
export const getOnlyGanttTasksByProjectId = async (projectId: string) => {
  return prisma.ganttTask.findMany({ where: { projectId } });
};

export const getGanttTasks = async (projectId?: string) => {
  if (projectId) {
    return prisma.ganttTask.findMany({ where: { projectId } });
  }
  return prisma.ganttTask.findMany();
};

export const getGanttTaskById = async (id: string) => {
  return prisma.ganttTask.findUnique({ where: { id } });
};

export const createGanttTask = async (
  task: PrismaGanttTask & { color?: string; startDate?: string; endDate?: string },
) => {
  const { projectId, color, startDate, endDate, ...rest } = task as any;

  // Check if project exists
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new Error('Project not found');
  }

  const data = {
    ...rest,
    id: randomUUID(),
    start: startDate ?? rest.start,
    end: endDate ?? rest.end,
    startDate: startDate ?? rest.start,
    endDate: endDate ?? rest.end,
    color: color || 'bg-blue-500',
    project: { connect: { id: projectId } },
  };
  return prisma.ganttTask.create({ data });
};

export const updateGanttTask = async (id: string, updates: Partial<PrismaGanttTask>) => {
  try {
    return await prisma.ganttTask.update({ where: { id }, data: updates });
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
