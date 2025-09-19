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

  // Seed super admin user
  await prisma.user.upsert({
    where: { email: 'superadmin@calendation.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'superadmin@calendation.com',
      avatarUrl: null,
      projectId: null,
      status: 1,
    },
  });
}
main().finally(() => prisma.$disconnect());
