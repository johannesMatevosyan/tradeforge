import { Injectable } from "@angular/core";
import { TradingOrder } from '@tradeforge/shared-types';
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TradingOrdersService {
  private ordersSubject = new BehaviorSubject<TradingOrder[]>([]);

  orders$ = this.ordersSubject.asObservable();

  placeOrder(order: TradingOrder): void {
    const currentOrders = this.ordersSubject.value;
    this.ordersSubject.next([order, ...currentOrders].slice(0, 10));
  }

  cancelOrder(orderId: string): void {
    const updated: TradingOrder[] = this.ordersSubject.value.map((order) =>
      order.id === orderId
        ? { ...order, status: 'CANCELLED' }
        : order
    );

    this.ordersSubject.next(updated);
  }
}
