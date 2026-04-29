import { DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TradingOrder } from '@tradeforge/shared-types';
import { TradingOrdersService } from '@tradeforge/trading/trading-data-access';

@Component({
  selector: 'lib-orders-table',
  imports: [DatePipe],
  standalone: true,
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss'],
})
export class OrdersTableComponent {
  @Input() orders: TradingOrder[] = [];
  @Output() cancel = new EventEmitter<string>();

  private readonly ordersService = inject(TradingOrdersService);

  onCancel(orderId: string): void {
    this.ordersService.cancelOrder(orderId);
  }
}
