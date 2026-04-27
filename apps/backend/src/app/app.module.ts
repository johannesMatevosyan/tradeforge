import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { MarketDataModule } from './market-data/market-data.module';
import { OrdersModule } from './orders/orders.module';
import { PositionsModule } from './positions/positions.module';
import { PrismaModule } from './prisma/prisma.module';
import { SymbolsModule } from './symbols/symbols.module';
import { UsersModule } from './users/user.module';
import { WatchlistModule } from './watchlist/watchlist.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    SymbolsModule,
    WatchlistModule,
    OrdersModule,
    AuthModule,
    UsersModule,
    MarketDataModule,
    PositionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
