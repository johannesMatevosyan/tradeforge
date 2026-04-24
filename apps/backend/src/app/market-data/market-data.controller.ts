import { Controller, Get } from '@nestjs/common';
import { MarketPrice } from '@tradeforge/shared-types';
import { MarketDataService } from './market-data.service';

@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get('prices')
  getPrices(): MarketPrice[] {
    return this.marketDataService.getPrices();
  }
}
