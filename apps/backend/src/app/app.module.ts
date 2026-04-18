import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { OrdersModule } from './orders/orders.module';
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
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
