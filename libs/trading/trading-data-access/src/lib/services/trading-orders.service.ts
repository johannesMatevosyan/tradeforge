import { inject, Injectable } from "@angular/core";
import { NotificationService } from '@tradeforge/notifications/notification-data-access';
import { TradingOrder, TradingPosition, TradingPositionView } from '@tradeforge/shared-types';
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TradingOrdersService {
  private ordersSubject = new BehaviorSubject<TradingOrder[]>([]);
  private notificationService = inject(NotificationService);

  orders$ = this.ordersSubject.asObservable();

  placeOrder(order: TradingOrder): void {
    const currentOrders = this.ordersSubject.value;
    this.ordersSubject.next([order, ...currentOrders].slice(0, 10));

    this.notificationService.add({
      type: 'order',
      title: 'Order placed',
      message: `${order.side} ${order.quantity} ${order.symbol} at ${order.price}`,
    });
  }

  cancelOrder(orderId: string): void {
    const updated: TradingOrder[] = this.ordersSubject.value.map((order) =>
      order.id === orderId
        ? { ...order, status: 'CANCELLED' }
        : order
    );

    this.ordersSubject.next(updated);

    this.notificationService.add({
      type: 'order',
      title: 'Order cancelled',
      message: `Order ${orderId} was cancelled`,
    });
  }

  getPositions(orders: TradingOrder[]): TradingPosition[] {
    const map = new Map<string, TradingPosition>();

    orders
      .filter((order) => order.status === 'FILLED')
      .forEach((order) => {
        const current = map.get(order.symbol) ?? {
          symbol: order.symbol,
          quantity: 0,
          averagePrice: 0,
          invested: 0,
        };

        const signedQuantity =
          order.side === 'BUY' ? order.quantity : -order.quantity;

        const newQuantity = current.quantity + signedQuantity;

        const newInvested =
          order.side === 'BUY'
            ? current.invested + order.quantity * order.price
            : current.invested - order.quantity * current.averagePrice;

        map.set(order.symbol, {
          symbol: order.symbol,
          quantity: newQuantity,
          invested: newInvested,
          averagePrice: newQuantity > 0 ? newInvested / newQuantity : 0,
        });
      });

    return Array.from(map.values()).filter((position) => position.quantity > 0);
  }

  enrichPositionsWithPrices(
    positions: TradingPosition[],
    prices: Record<string, number>
  ): TradingPositionView[] {
    return positions.map((position) => {
      const currentPrice =
        prices[position.symbol] ?? position.averagePrice;

      const marketValue = position.quantity * currentPrice;
      const pnl = marketValue - position.invested;

      return {
        ...position,
        currentPrice,
        marketValue,
        pnl,
        pnlPercent:
          position.invested > 0 ? (pnl / position.invested) * 100 : 0,
      };
    });
  }
}
