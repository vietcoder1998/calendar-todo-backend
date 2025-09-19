import { User } from '@/types';
import { PrismaClient } from '@prisma/client';
const prisma: PrismaClient = new PrismaClient();

export const getUsers = async (): Promise<User[]> => {
  return prisma.user.findMany();
};

export const getUsersByProject = async (projectId: string): Promise<User[]> => {
  return prisma.user.findMany({ where: { projectId } });
};

export const createUser = async (data: any): Promise<User> => {
  return prisma.user.create({ data });
};

export const updateUser = async (id: string, data: any): Promise<User> => {
  return prisma.user.update({ where: { id: id }, data });
};

export const deleteUser = async (id: string): Promise<void> => {
  await prisma.user.delete({ where: { id: id } });
};
