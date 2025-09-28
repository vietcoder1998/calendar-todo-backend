import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getNotificationTemplates(projectId?: string) {
  return prisma.notificationTemplate.findMany({
    where: projectId ? { projectId } : {},
    orderBy: { createdAt: 'desc' },
  });
}

export async function getNotificationTemplateById(id: string) {
  return prisma.notificationTemplate.findUnique({ where: { id } });
}

export async function createNotificationTemplate(data: any) {
  return prisma.notificationTemplate.create({ data });
}

export async function updateNotificationTemplate(id: string, data: any) {
  return prisma.notificationTemplate.update({ where: { id }, data });
}

export async function deleteNotificationTemplate(id: string) {
  await prisma.notificationTemplate.delete({ where: { id } });
  return true;
}
