import { AnalyticsOrder, SymbolAnalytics } from '../models/analytics.models';

export function buildSymbolAnalytics(
  orders: AnalyticsOrder[]
): SymbolAnalytics[] {
  const map = new Map<string, SymbolAnalytics>();

  for (const order of orders) {
    const current = map.get(order.symbol) ?? {
      symbol: order.symbol,
      orderCount: 0,
      buyCount: 0,
      sellCount: 0,
      volume: 0,
    };

    current.orderCount += 1;
    current.volume += Number(order.quantity);

    if (order.side === 'BUY') current.buyCount += 1;
    if (order.side === 'SELL') current.sellCount += 1;

    map.set(order.symbol, current);
  }

  return [...map.values()].sort((a, b) => b.orderCount - a.orderCount);
}
