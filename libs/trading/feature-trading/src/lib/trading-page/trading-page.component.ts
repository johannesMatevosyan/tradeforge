import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TradingOrder } from '@tradeforge/shared-types';
import { TradingOrdersService, TradingSymbolsService } from '@tradeforge/trading/trading-data-access';
import {
  ChartComponent,
  PlaceOrderComponent,
  RecentOrdersComponent,
} from '@tradeforge/trading/ui';

@Component({
  selector: 'lib-trading-page',
  imports: [ChartComponent, RecentOrdersComponent, PlaceOrderComponent, AsyncPipe],
  standalone: true,
  templateUrl: './trading-page.component.html',
  styleUrls: ['./trading-page.component.scss'],
})
export class TradingPageComponent {
  private readonly ordersService = inject(TradingOrdersService);
  private readonly symbolsService = inject(TradingSymbolsService);

  orders$ = this.ordersService.orders$;
  selectedSymbol$ = this.symbolsService.selectedSymbol$;

  selectedSymbol: string = 'BTC/USD';
  orders: TradingOrder[] = [];

  onOrderPlaced(order: TradingOrder): void {
    this.ordersService.placeOrder(order);
  }

  onSymbolSelected(symbol: string): void {
    this.symbolsService.selectSymbol(symbol);
  }
}
