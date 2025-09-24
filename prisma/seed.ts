import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed asset types
  const types = ['todo', 'linkedItem', 'file', 'location', 'ganttTask'];
  for (const name of types) {
    await prisma.assetType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Seed example project
  const exampleProject = await prisma.project.upsert({
    where: { id: 'example-project-id' },
    update: {},
    create: {
      id: 'example-project-id',
      name: 'Example Project',
      description: 'A demo project for seeding',
      status: 1,
    },
  });

  // Seed super admin user
  await prisma.user.upsert({
    where: { email: 'superadmin@calendation.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'superadmin@calendation.com',
      avatarUrl: null,
      projectId: exampleProject.id,
      status: 1,
    },
  });

  // Seed default notification templates
  const defaultTemplates = [
    {
      name: 'Task Assigned',
      subject: 'You have been assigned a new task',
      body: 'Hello, you have a new task: {{taskTitle}}. Please check your dashboard.',
      type: 'info',
      projectId: exampleProject.id,
    },
    {
      name: 'Task Completed',
      subject: 'A task has been completed',
      body: 'Task {{taskTitle}} has been marked as completed.',
      type: 'success',
      projectId: exampleProject.id,
    },
    {
      name: 'Task Overdue',
      subject: 'A task is overdue',
      body: 'Task {{taskTitle}} is overdue. Please take action.',
      type: 'warning',
      projectId: exampleProject.id,
    },
  ];
  for (const tpl of defaultTemplates) {
    await prisma.notificationTemplate.create({
      data: tpl,
    });
  }
}
main().finally(() => prisma.$disconnect());
