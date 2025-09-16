import { PrismaClient, Project } from '@prisma/client';

const prisma = new PrismaClient();

export const getProjects = async (): Promise<Project[]> => {
  return prisma.project.findMany();
};

export const createProject = async (data: any): Promise<Project> => {
  // TODO: validate data
  return prisma.project.create({ data });
};

export const updateProject = async (id: string, data: any): Promise<Project> => {
  // TODO: validate data
  return prisma.project.update({ where: { id }, data });
};

export const deleteProject = async (id: string): Promise<void> => {
  await prisma.project.delete({ where: { id } });
};
