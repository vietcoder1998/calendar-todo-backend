import { PrismaClient, GanttTask as PrismaGanttTask } from '@prisma/client';
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
export const createGanttTask = async (task: PrismaGanttTask) => {
  return prisma.ganttTask.create({ data: task });
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
