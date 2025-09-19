import { Project, Todo } from '@/types';
import { PrismaClient } from '@prisma/client';

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
  const project = await prisma.project.findUnique({
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
  if (!project) return null;
  // Map todos[].relatedTaskIds from JsonValue to string[] | null
  return {
    ...project,
    todos: project.todos.map((todo: any) => ({
      ...todo,
      relatedTaskIds: Array.isArray(todo.relatedTaskIds)
        ? todo.relatedTaskIds
        : typeof todo.relatedTaskIds === 'string'
          ? JSON.parse(todo.relatedTaskIds)
          : null,
    })),
  };
};

export const getProjects = async (): Promise<ProjectWithAll[]> => {
  const projects = await prisma.project.findMany({
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
  // Map todos[].relatedTaskIds from JsonValue to string[] | null
  return projects.map((project: any) => ({
    ...project,
    todos: project.todos.map((todo: any) => ({
      ...todo,
      relatedTaskIds: Array.isArray(todo.relatedTaskIds)
        ? todo.relatedTaskIds
        : typeof todo.relatedTaskIds === 'string'
          ? JSON.parse(todo.relatedTaskIds)
          : null,
    })),
  }));
};

export const createProject = async (data: any): Promise<Project> => {
  // TODO: validate data
  const project = await prisma.project.create({ data });

  // Create an admin user for the project if not already present
  const adminId = `admin-${project.id}`;
  await prisma.user.upsert({
    where: { id: adminId },
    update: {},
    create: {
      id: adminId,
      name: 'Admin',
      email: `admin-${project.id}@example.com`,
      projectId: project.id,
    },
  });

  return project;
};

export const updateProject = async (id: string, data: any): Promise<Project> => {
  // TODO: validate data
  return prisma.project.update({ where: { id }, data });
};

export const deleteProject = async (id: string): Promise<void> => {
  await prisma.project.delete({ where: { id } });
};
