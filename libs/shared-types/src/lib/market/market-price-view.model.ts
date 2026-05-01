export interface MarketPriceView {
  symbol: string;
  price: number;
  previousPrice: number | null;
  direction: 'up' | 'down' | 'neutral';
}
