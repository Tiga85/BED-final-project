const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      id: 'uuid1',
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
  });

  // Create Categories
  const category1 = await prisma.category.create({
    data: {
      id: 'uuid2',
      name: 'Music',
    },
  });

  // Create Events
  const event1 = await prisma.event.create({
    data: {
      id: 'uuid3',
      title: 'Concert',
      date: new Date(),
      categories: {
        connect: [{ id: category1.id }],
      },
    },
  });

  console.log({ user1, category1, event1 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
