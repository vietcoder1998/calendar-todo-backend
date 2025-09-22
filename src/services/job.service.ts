import { PrismaClient } from '@prisma/client';
import { Job } from '@/types';

const prisma = new PrismaClient();

function fromPrismaJob(job: any): Job {
  return {
    ...job,
    createdAt: job.createdAt instanceof Date ? job.createdAt.toISOString() : job.createdAt,
    updatedAt: job.updatedAt instanceof Date ? job.updatedAt.toISOString() : job.updatedAt,
  };
}

export const getJobs = async (webhookId?: string): Promise<Job[]> => {
  const where = webhookId ? { webhookId } : {};
  const jobs = await prisma.job.findMany({ where });
  return jobs.map(fromPrismaJob);
};

export const getJobById = async (id: string): Promise<Job | null> => {
  const job = await prisma.job.findUnique({ where: { id } });
  return job ? fromPrismaJob(job) : null;
};

export const createJob = async (data: Partial<Job>): Promise<Job> => {
  const job = await prisma.job.create({ data: data as any });
  return fromPrismaJob(job);
};

export const updateJob = async (id: string, data: Partial<Job>): Promise<Job> => {
  const job = await prisma.job.update({ where: { id }, data: data as any });
  return fromPrismaJob(job);
};

export const deleteJob = async (id: string): Promise<void> => {
  await prisma.job.delete({ where: { id } });
};
