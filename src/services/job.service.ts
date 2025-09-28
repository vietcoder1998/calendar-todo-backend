import { PrismaClient } from '@prisma/client';
import type { JobInput } from '../types';

const prisma = new PrismaClient();

export async function createJob(data: JobInput) {
  return prisma.job.create({ data });
}

export async function getJobs(projectId?: string, webhookId?: string) {
  return prisma.job.findMany({
    where: {
      ...(projectId ? { projectId } : {}),
      ...(webhookId ? { webhookId } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateJob(id: string, updates: Partial<JobInput>) {
  return prisma.job.update({ where: { id }, data: updates });
}

export async function deleteJob(id: string) {
  return prisma.job.delete({ where: { id } });
}

export async function getJobById(id: string) {
  return prisma.job.findUnique({ where: { id } });
}
