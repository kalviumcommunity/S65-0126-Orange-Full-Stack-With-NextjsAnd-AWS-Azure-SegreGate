import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.user.createMany({
    data: [
      { name: 'Alice', email: 'alice@example.com', role: 'admin' },
      { name: 'Bob', email: 'bob@example.com', role: 'user' },
    ],
    skipDuplicates: true,
  });

  const user = await prisma.user.findFirst({ where: { email: 'alice@example.com' } });

  if (user) {
    const project = await prisma.project.upsert({
      where: { id: 1 },
      update: {},
      create: {
        title: 'SegreGate Pilot',
        description: 'Initial pilot project',
        ownerId: user.id,
      },
    });

    await prisma.task.createMany({
      data: [
        { title: 'Create schema', status: 'done', projectId: project.id },
        { title: 'Seed data', status: 'done', projectId: project.id },
      ],
      skipDuplicates: true,
    });
  }

  console.log('Seeding complete');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
