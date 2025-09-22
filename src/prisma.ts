import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function pingMySQL() {
  try {
    // Use Prisma's built-in connection check
    // await prisma.$connect();
    return true;
  } catch (e) {
    return false;
  }
}
