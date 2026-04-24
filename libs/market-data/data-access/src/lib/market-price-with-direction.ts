import { MarketPrice } from '@tradeforge/shared-types';

export interface MarketPriceWithDirection extends MarketPrice {
  direction: 'up' | 'down' | 'flat';
}
