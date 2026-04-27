export interface WatchlistItem {
  id: string;
  symbolId: string;
  symbolCode: string;
  displayName: string;
  label: string;
  isActive: boolean;
}

export type PriceDirection = 'up' | 'down' | 'flat';

export interface LivePriceState {
  price: number;
  direction: PriceDirection;
}
