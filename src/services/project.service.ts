import { PrismaClient, Project, Todo } from '@prisma/client';

const prisma = new PrismaClient();

export const getProjectById = async (id: string): Promise<ProjectWithTodos | null> => {
  return prisma.project.findUnique({
    where: { id },
    include: { todos: true },
  });
};

type ProjectWithTodos = Project & { todos: Todo[] };

export const getProjects = async (): Promise<ProjectWithTodos[]> => {
  return prisma.project.findMany({ include: { todos: true } });
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
