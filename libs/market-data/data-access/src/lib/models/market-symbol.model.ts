export interface MarketSymbol {
  id: string;
  code: string; // BTC/USD
  baseAsset: string;
  quoteAsset: string;
  description?: string | null;
  isActive: boolean;
}
