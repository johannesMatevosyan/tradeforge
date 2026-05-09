export interface MarketRowView {
  symbol: string;
  name?: string;

  price: number;
  previousPrice: number | null;

  direction: 'up' | 'down' | 'neutral';

  change: number;
  changePercent: number;

  updatedAt?: number;
}
