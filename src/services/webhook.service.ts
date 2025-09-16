import { PrismaClient, Webhook as PrismaWebhook } from '@prisma/client';
const prisma = new PrismaClient();

export const getWebhooks = async (projectId?: string) => {
  if (projectId) {
    return prisma.webhook.findMany({ where: { projectId } });
  }
  return prisma.webhook.findMany();
};
export const createWebhook = async (webhook: PrismaWebhook) => {
  return prisma.webhook.create({ data: webhook });
};
export const updateWebhook = async (id: string, updates: Partial<PrismaWebhook>) => {
  try {
    return await prisma.webhook.update({ where: { id }, data: updates });
  } catch {
    return null;
  }
};
export const deleteWebhook = async (id: string) => {
  try {
    await prisma.webhook.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
};
