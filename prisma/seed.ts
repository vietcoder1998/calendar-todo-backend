import { PrismaClient } from '@prisma/client';
import { NotificationResourceType } from '../src/enum';
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

  // Seed notification templates
  const notificationTemplates = [
    {
      name: 'Task Assigned',
      subject: 'You have been assigned a new task',
      body: 'Hello, you have a new task: {{taskTitle}}. Please check your dashboard.',
      type: NotificationResourceType.Todo,
      projectId: exampleProject.id,
    },
    {
      name: 'Task Completed',
      subject: 'A task has been completed',
      body: 'Task {{taskTitle}} has been marked as completed.',
      type: NotificationResourceType.Todo,
      projectId: exampleProject.id,
    },
    {
      name: 'Task Overdue',
      subject: 'A task is overdue',
      body: 'Task {{taskTitle}} is overdue. Please take action.',
      type: NotificationResourceType.Todo,
      projectId: exampleProject.id,
    },
    {
      name: 'Gantt Task Updated',
      subject: 'Gantt task updated',
      body: 'Gantt task {{ganttTaskName}} has been updated.',
      type: NotificationResourceType.GanttTask,
      projectId: exampleProject.id,
    },
    {
      name: 'History Entry',
      subject: 'History entry added',
      body: 'A new history entry was added: {{historyDetail}}.',
      type: NotificationResourceType.History,
      projectId: exampleProject.id,
    },
    {
      name: 'Permission Changed',
      subject: 'Permission changed',
      body: 'Permission for {{userName}} has been changed to {{permissionLevel}}.',
      type: NotificationResourceType.Permission,
      projectId: exampleProject.id,
    },
    {
      name: 'File Uploaded',
      subject: 'File uploaded',
      body: 'File {{fileName}} has been uploaded.',
      type: NotificationResourceType.File,
      projectId: exampleProject.id,
    },
    {
      name: 'Asset Added',
      subject: 'Asset added',
      body: 'Asset {{assetName}} has been added.',
      type: NotificationResourceType.Asset,
      projectId: exampleProject.id,
    },
    {
      name: 'User Joined',
      subject: 'User joined',
      body: 'User {{userName}} has joined the project.',
      type: NotificationResourceType.User,
      projectId: exampleProject.id,
    },
    {
      name: 'Location Updated',
      subject: 'Location updated',
      body: 'Location {{locationName}} has been updated.',
      type: NotificationResourceType.Location,
      projectId: exampleProject.id,
    },
    {
      name: 'Webhook Triggered',
      subject: 'Webhook triggered',
      body: 'Webhook {{webhookName}} was triggered.',
      type: NotificationResourceType.Webhook,
      projectId: exampleProject.id,
    },
    {
      name: 'Linked Item Added',
      subject: 'Linked item added',
      body: 'Linked item {{linkedItemName}} has been added.',
      type: NotificationResourceType.LinkedItem,
      projectId: exampleProject.id,
    },
    {
      name: 'Welcome',
      subject: 'Welcome to {{projectName}}!',
      body: 'Hi {{userName}}, welcome to {{projectName}}. We are glad to have you!',
      type: NotificationResourceType.User,
      projectId: exampleProject.id,
    },
    {
      name: 'Custom Alert',
      subject: '{{alertTitle}}',
      body: '{{alertMessage}}',
      type: NotificationResourceType.Resource,
      projectId: exampleProject.id,
    },
    {
      name: 'Error Notification',
      subject: 'Error: {{errorTitle}}',
      body: 'An error occurred: {{errorMessage}}',
      type: NotificationResourceType.Resource,
      projectId: exampleProject.id,
    },
  ];
  for (const tpl of notificationTemplates) {
    await prisma.notificationTemplate.create({
      data: tpl,
    });
  }
}
main().finally(() => prisma.$disconnect());
