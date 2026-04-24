import { Injectable } from '@nestjs/common';
import { MarketPrice } from '@tradeforge/shared-types';

@Injectable()
export class MarketDataService {
  getPrices(): MarketPrice[] {
    const now = new Date().toISOString();

    return [
      { symbol: 'BTCUSD', price: 68450.25, timestamp: now },
      { symbol: 'ETHUSD', price: 3520.8, timestamp: now },
      { symbol: 'XAUUSD', price: 2378.4, timestamp: now },
    ];
  }
}
