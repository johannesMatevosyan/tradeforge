import { Component } from '@angular/core';
import { TradingOrder } from '@tradeforge/shared-types';
import {
  ChartComponent,
  PlaceOrderComponent,
  RecentOrdersComponent,
} from '@tradeforge/trading/ui';

@Component({
  selector: 'lib-trading-page',
  imports: [ChartComponent, RecentOrdersComponent, PlaceOrderComponent],
  standalone: true,
  templateUrl: './trading-page.component.html',
  styleUrls: ['./trading-page.component.scss'],
})
export class TradingPageComponent {
  selectedSymbol: string = 'BTC/USD';
  currentPrice: number = 43250;
  orders: TradingOrder[] = [];

  onOrderPlaced(order: TradingOrder): void {
    this.orders = [order, ...this.orders].slice(0, 10);
  }
}
