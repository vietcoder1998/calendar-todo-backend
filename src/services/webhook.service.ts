const { v4: uuidv4 } = require('uuid');
import { Webhook as WebhookType } from '../types';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const fromPrismaWebhook = (prismaWebhook: any): WebhookType => ({
  id: prismaWebhook.id,
  name: prismaWebhook.name,
  platform: prismaWebhook.platform,
  token: prismaWebhook.token ?? null,
  chatId: prismaWebhook.chatId ?? null,
  webhookUrl: prismaWebhook.webhookUrl ?? null,
  enabled: prismaWebhook.enabled,
  projectId: prismaWebhook.projectId,
});

export const getWebhooks = async (projectId?: string) => {
  if (projectId) {
    const webhooks = await prisma.webhook.findMany({ where: { projectId } });
    return webhooks.map(fromPrismaWebhook);
  }
  const webhooks = await prisma.webhook.findMany();
  return webhooks.map(fromPrismaWebhook);
};

export const createWebhook = async (webhook: WebhookType) => {
  const created = await prisma.webhook.create({
    data: {
      ...webhook,
      id: webhook.id || uuidv4(), // Ensure UUID is set
    },
  });
  return fromPrismaWebhook(created);
};

export const updateWebhook = async (id: string, updates: Partial<WebhookType>) => {
  try {
    const updated = await prisma.webhook.update({ where: { id }, data: updates });
    return fromPrismaWebhook(updated);
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
