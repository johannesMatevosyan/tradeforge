import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TradingOrder } from '@tradeforge/shared-types';

@Component({
  selector: 'lib-orders-table',
  imports: [DatePipe],
  standalone: true,
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss'],
})
export class OrdersTableComponent {
  @Input() orders: TradingOrder[] = [];
}
