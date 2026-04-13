import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { SymbolsModule } from './symbols/symbols.module';
import { WatchlistModule } from './watchlist/watchlist.module';

@Module({
  imports: [PrismaModule, HealthModule, SymbolsModule, WatchlistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
