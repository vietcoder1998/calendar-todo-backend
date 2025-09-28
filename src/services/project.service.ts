import { GanttTask, Project, ProjectWithAll } from '@/types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    ganttTasks: project.ganttTasks.map((task: any) => ({
      ...task,
      position: task.position === null ? 0 : task.position,
    })),
    files: project.files.map((file: any) => ({
      ...file,
      position: file.position === undefined || file.position === null ? 0 : file.position,
    })),
    linkedItems: project.linkedItems.map((item: any) => ({
      ...item,
      position: item.position === undefined || item.position === null ? 0 : item.position,
    })),
    permissions: project.permissions.map((permission: any) => ({
      ...permission,
      name: permission.name === null ? undefined : permission.name,
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
  const project = await prisma.project.create({ data });
  const defaultRoles = ['super_admin', 'admin', 'viewer', 'guest'];
  await prisma.role.createMany({
    data: defaultRoles.map((name) => ({ name, projectId: project.id })),
    skipDuplicates: true,
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

// Connect user to project
export const connectUserToProject = async (projectId: string, userId: string): Promise<Project> => {
  return prisma.project.update({
    where: { id: projectId },
    data: { users: { connect: [{ id: userId }] } },
  });
};
