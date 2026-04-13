import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';

console.log('🌱 Seed script started');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
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

  console.log('Inserted rows:', result.count);

  const rows = await prisma.symbol.findMany();
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
