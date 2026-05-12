export interface AnalyticsOverview {
  totalTrades: number;
  openPositions: number;
  closedPositions: number;
  realizedPnl: number;
  unrealizedPnl: number;
}

export interface AnalyticsActivity {
  buyOrders: number;
  sellOrders: number;
  filledOrders: number;
  openOrders: number;
}

export interface SymbolAnalytics {
  symbol: string;
  orderCount: number;
  buyCount: number;
  sellCount: number;
  volume: number;
}

export interface PerformanceInsight {
  label: string;
  value: string;
  tone: 'positive' | 'negative' | 'neutral';
}

export type AnalyticsOrder = {
  symbol: string;
  side: 'BUY' | 'SELL';
  status: string;
  quantity: number | string;
};
