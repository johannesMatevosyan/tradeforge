import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OrdersApi, OrdersEvents } from '@tradeforge/orders/order-data-access';
import { startWith, switchMap } from 'rxjs';

@Component({
  selector: 'lib-orders-history',
  imports: [AsyncPipe],
  standalone: true,
  templateUrl: './orders-history.html',
  styleUrls: ['./orders-history.scss'],
})
export class OrdersHistory {
  private readonly ordersApi = inject(OrdersApi);
  private readonly ordersEvents = inject(OrdersEvents);

  readonly orders$ = this.ordersEvents.orderCreated$.pipe(
    startWith(null),
    switchMap(() => this.ordersApi.getOrders())
  );
}
