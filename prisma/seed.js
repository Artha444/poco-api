const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const cashierPassword = await bcrypt.hash('cashier123', 10);

  // Upsert users to avoid duplicate errors on re-run
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const cashier = await prisma.user.upsert({
    where: { username: 'cashier' },
    update: {},
    create: {
      username: 'cashier',
      password: cashierPassword,
      role: 'CASHIER',
    },
  });

  console.log({ admin, cashier });

  // Create some products
  const products = [
    {
      name: 'POCO F5',
      description: 'The origin of speed.',
      price: 4999000,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=500',
    },
    {
      name: 'POCO X5 Pro 5G',
      description: 'The secret to winning.',
      price: 3999000,
      stock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=500',
    },
    {
      name: 'POCO M5',
      description: 'The performance player.',
      price: 2199000,
      stock: 200,
      imageUrl: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&q=80&w=500',
    },
  ];

  for (const p of products) {
    const product = await prisma.product.create({
      data: p,
    });
    console.log(`Created product: ${product.name}`);
  }
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
