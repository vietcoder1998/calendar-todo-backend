import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const types = ['todo', 'linkedItem', 'file', 'location', 'ganttTask'];
  for (const name of types) {
    await prisma.assetType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}
main().finally(() => prisma.$disconnect());
