import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getLabelsByProjectId(projectId: string) {
  return prisma.label.findMany({ where: { projectId } });
}
