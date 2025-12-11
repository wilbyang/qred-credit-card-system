import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create companies
  const company1 = await prisma.company.create({
    data: {
      name: 'Company AB',
    },
  });

  const company2 = await prisma.company.create({
    data: {
      name: 'Tech Solutions Ltd',
    },
  });

  // Create cards
  const card1 = await prisma.card.create({
    data: {
      companyId: company1.id,
      cardNumber: '**** **** **** 1234',
      status: 'inactive',
      limit: 10000,
      currentSpend: 5400,
      currency: 'kr',
      cardImageUrl: '/assets/card-image.png',
    },
  });

  const card2 = await prisma.card.create({
    data: {
      companyId: company1.id,
      cardNumber: '**** **** **** 5678',
      status: 'active',
      limit: 15000,
      currentSpend: 3200,
      currency: 'kr',
      cardImageUrl: '/assets/card-image.png',
    },
  });

  const card3 = await prisma.card.create({
    data: {
      companyId: company2.id,
      cardNumber: '**** **** **** 9012',
      status: 'inactive',
      limit: 20000,
      currentSpend: 8900,
      currency: 'kr',
      cardImageUrl: '/assets/card-image.png',
    },
  });

  // Create invoices
  await prisma.invoice.create({
    data: {
      cardId: card1.id,
      dueDate: new Date('2025-12-25T00:00:00Z'),
      amount: 5400,
      currency: 'kr',
      isPaid: false,
    },
  });

  await prisma.invoice.create({
    data: {
      cardId: card2.id,
      dueDate: new Date('2025-12-20T00:00:00Z'),
      amount: 3200,
      currency: 'kr',
      isPaid: false,
    },
  });

  // Create transactions for card1
  const transactions = [
    {
      cardId: card1.id,
      description: 'Transaction data',
      amount: 150.50,
      dataPoints: 'Data points',
      date: new Date('2025-12-08T10:30:00Z'),
    },
    {
      cardId: card1.id,
      description: 'Transaction data',
      amount: 245.75,
      dataPoints: 'Data points',
      date: new Date('2025-12-07T14:15:00Z'),
    },
    {
      cardId: card1.id,
      description: 'Transaction data',
      amount: 89.99,
      dataPoints: 'Data points',
      date: new Date('2025-12-06T09:45:00Z'),
    },
  ];

  // Create 57 transactions total (to match "54 more items" in UI)
  for (let i = 0; i < 57; i++) {
    await prisma.transaction.create({
      data: {
        cardId: card1.id,
        description: `Transaction data ${i + 1}`,
        amount: Math.random() * 500 + 50,
        dataPoints: 'Data points',
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Create some transactions for card2
  for (let i = 0; i < 25; i++) {
    await prisma.transaction.create({
      data: {
        cardId: card2.id,
        description: `Transaction data ${i + 1}`,
        amount: Math.random() * 400 + 30,
        dataPoints: 'Data points',
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${2} companies`);
  console.log(`   - ${3} cards`);
  console.log(`   - ${82} transactions`);
  console.log(`   - ${2} invoices`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
