import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { PrismaClient, UserRole } from '../generated/prisma/client';

console.log('🌱 Seed script started');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
  const viewerPasswordHash = await bcrypt.hash('Viewer123!', 10);

  await prisma.user.upsert({
    where: {
      email: 'admin@tradeforge.local',
    },
    update: {
      name: 'Admin User',
      role: UserRole.ADMIN,
      passwordHash: adminPasswordHash,
    },
    create: {
      email: 'admin@tradeforge.local',
      name: 'Admin User',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: {
      email: 'demo@tradeforge.local',
    },
    update: {
      name: 'Demo Viewer',
      role: UserRole.VIEWER,
      passwordHash: viewerPasswordHash,
    },
    create: {
      email: 'demo@tradeforge.local',
      name: 'Demo Viewer',
      passwordHash: viewerPasswordHash,
      role: UserRole.VIEWER,
    },
  });

  const result = await prisma.symbol.createMany({
    data: [
      {
        code: 'BTCUSD',
        baseAsset: 'BTC',
        quoteAsset: 'USD',
        description: 'Bitcoin / US Dollar',
      },
      {
        code: 'ETHUSD',
        baseAsset: 'ETH',
        quoteAsset: 'USD',
        description: 'Ethereum / US Dollar',
      },
      {
        code: 'EURUSD',
        baseAsset: 'EUR',
        quoteAsset: 'USD',
        description: 'Euro / US Dollar',
      },
      {
        code: 'XAUUSD',
        baseAsset: 'XAU',
        quoteAsset: 'USD',
        description: 'Gold / US Dollar',
        isActive: false,
      },
    ],
    skipDuplicates: true,
  });

  const rows = await prisma.symbol.findMany();
  console.log('Seeded symbols:', rows.length);
}

main()
  .then(async () => {
    console.log('✅ Seed completed successfully');
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('❌ Seed failed:', error.message || error);
    await prisma.$disconnect();
    process.exit(1);
  });
