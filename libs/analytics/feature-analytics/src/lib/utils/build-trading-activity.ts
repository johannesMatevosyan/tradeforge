import { AnalyticsActivity, AnalyticsOrder } from '../models/analytics.models';

export function buildTradingActivity(orders: AnalyticsOrder[]): AnalyticsActivity {
  return {
    buyOrders: orders.filter((o) => o.side === 'BUY').length,
    sellOrders: orders.filter((o) => o.side === 'SELL').length,
    filledOrders: orders.filter((o) => o.status === 'FILLED').length,
    openOrders: orders.filter((o) => o.status === 'OPEN').length,
  };
}
