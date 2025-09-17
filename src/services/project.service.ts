import { PrismaClient, Project, Todo } from '@prisma/client';

const prisma = new PrismaClient();

// Adjust the type to include all related entities you want to return
type ProjectWithAll = Project & {
  todos: Todo[];
  files: any[];
  permissions: any[];
  linkedItems: any[];
  ganttTasks: any[];
  webhooks: any[];
  users: any[];
};

export const getProjectById = async (id: string): Promise<ProjectWithAll | null> => {
  return prisma.project.findUnique({
    where: { id },
    include: {
      todos: true,
      files: true,
      permissions: true,
      linkedItems: true,
      ganttTasks: true,
      webhooks: true,
      users: true,
    },
  });
};

export const getProjects = async (): Promise<ProjectWithAll[]> => {
  return prisma.project.findMany({
    include: {
      todos: true,
      files: true,
      permissions: true,
      linkedItems: true,
      ganttTasks: true,
      webhooks: true,
      users: true,
    },
  });
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
