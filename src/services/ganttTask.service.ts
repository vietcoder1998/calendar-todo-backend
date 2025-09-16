import { PrismaClient, GanttTask as PrismaGanttTask } from '@prisma/client';
import { randomUUID } from 'crypto';
const prisma = new PrismaClient();

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
  // Map projectId to project relation if present, and ignore color, startDate, endDate
  const { projectId, color, startDate, endDate, ...rest } = task as any;
  // Use startDate/endDate if present, otherwise use start/end
  const data = {
    ...rest,
    id: randomUUID(),
    start: startDate ?? rest.start,
    end: endDate ?? rest.end,
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
