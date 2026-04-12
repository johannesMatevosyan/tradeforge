import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { SymbolsModule } from './symbols/symbols.module';

@Module({
  imports: [HealthModule, SymbolsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
