export interface TradingPosition {
  symbol: string;
  quantity: number;
  averagePrice: number;
  invested: number;
}

export interface TradingPositionView extends TradingPosition {
  currentPrice: number;
  marketValue: number;
  pnl: number;
  pnlPercent: number;
}
