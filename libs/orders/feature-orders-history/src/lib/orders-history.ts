import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OrdersApi } from '@tradeforge/orders/order-data-access';

@Component({
  selector: 'lib-orders-history',
  imports: [AsyncPipe],
  standalone: true,
  templateUrl: './orders-history.html',
  styleUrls: ['./orders-history.scss'],
})
export class OrdersHistory {
  private readonly ordersApi = inject(OrdersApi);

  readonly orders$ = this.ordersApi.getOrders();
}
