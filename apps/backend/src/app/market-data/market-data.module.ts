import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { MarketDataController } from './market-data.controller';
import { MarketDataGateway } from './market-data.gateway';
import { MarketDataService } from './market-data.service';

@Module({
  imports: [OrdersModule],
  controllers: [MarketDataController],
  providers: [MarketDataService, MarketDataGateway],
  exports: [MarketDataService],
})
export class MarketDataModule {}
