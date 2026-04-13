import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? '' }),
});

async function main() {
  await prisma.symbol.createMany({
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
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
