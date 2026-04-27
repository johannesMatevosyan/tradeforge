import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@tradeforge.local' },
  });

  if (!demoUser) {
    throw new Error('Demo user not found');
  }

  const symbols = await prisma.symbol.findMany({
    where: {
      code: {
        in: ['BTCUSD', 'ETHUSD', 'XAUUSD'],
      },
    },
  });

  for (const symbol of symbols) {
    await prisma.watchlistItem.create({
      data: {
        userId: demoUser.id,
        symbolId: symbol.id,
      },
    });
  }

  console.log(`Created ${symbols.length} watchlist items`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
