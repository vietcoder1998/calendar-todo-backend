import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsers = async (): Promise<User[]> => {
  return prisma.user.findMany();
};

export const createUser = async (data: any): Promise<User> => {
  return prisma.user.create({ data });
};

export const updateUser = async (id: number, data: any): Promise<User> => {
  return prisma.user.update({ where: { id }, data });
};

export const deleteUser = async (id: number): Promise<void> => {
  await prisma.user.delete({ where: { id } });
};
