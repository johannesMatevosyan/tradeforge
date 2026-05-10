import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MarketDataWsService } from '@tradeforge/market-data/market-data-access';
import { NotificationService } from '@tradeforge/notifications/notification-data-access';
import { OrdersApiService } from '@tradeforge/orders/order-data-access';
import { PlaceOrderPayload, TradingOrder } from '@tradeforge/shared-types';
import { PageHeaderComponent } from '@tradeforge/shared-ui';
import { TradingOrdersService, TradingSymbolsService } from '@tradeforge/trading/trading-data-access';
import {
  ChartComponent,
  MarketWatchComponent,
  PlaceOrderComponent,
  RecentOrdersComponent
} from '@tradeforge/trading/ui';
import { combineLatest, interval, map, startWith } from 'rxjs';

@Component({
  selector: 'lib-trading-page',
  imports: [
    ChartComponent,
    RecentOrdersComponent,
    PlaceOrderComponent,
    AsyncPipe,
    MarketWatchComponent,
    PageHeaderComponent
  ],
  standalone: true,
  templateUrl: './trading-page.component.html',
  styleUrls: ['./trading-page.component.scss'],
})
export class TradingPageComponent {
  private readonly ordersService = inject(TradingOrdersService);
  private readonly symbolsService = inject(TradingSymbolsService);
  private readonly notificationService = inject(NotificationService);
  private readonly ordersApiervice = inject(OrdersApiService);
  private readonly marketDataService = inject(MarketDataWsService);
  readonly pricesMap$ = this.marketDataService.pricesMap$;
  readonly pricesView$ = this.marketDataService.pricesView$;

  orders$ = this.ordersService.orders$;
  symbols = this.symbolsService.symbols;
  selectedSymbol$ = this.symbolsService.selectedSymbol$;

  selectedSymbol: string = 'BTC/USD';
  orders: TradingOrder[] = [];

  readonly selectedPrice$ = combineLatest([
    this.selectedSymbol$,
    this.marketDataService.pricesMap$
  ]).pipe(
    map(([symbol, prices]) => prices[symbol] ?? 0)
  );

  onOrderPlaced(order: PlaceOrderPayload): void {
    this.ordersApiervice.createOrder(order).subscribe({
      next: () => {
        this.ordersApiervice.getOrders(); // reload orders
        this.notificationService.loadNotifications();
      },
    });
  }

  onSymbolSelected(symbol: string): void {
    this.symbolsService.selectSymbol(symbol);
  }

  readonly now$ = interval(1000).pipe(
    startWith(0),
    map(() => Date.now())
  );

  readonly selectedPriceView$ = combineLatest([
    this.selectedSymbol$,
    this.pricesView$,
  ]).pipe(
    map(([symbol, prices]) => {
      const normalizedSymbol = symbol.replace('/', '');

      return prices.find((item) => item.symbol === normalizedSymbol) ?? null;
    })
  );

  readonly selectedPriceWithTime$ = combineLatest([
    this.selectedPriceView$,
    this.now$,
  ]).pipe(
    map(([price, now]) => {
      if (!price) {
        return null;
      }

      const secondsAgo = Math.max(
        0,
        Math.floor((now - price.updatedAt) / 1000)
      );

      return {
        ...price,
        secondsAgo,
      };
    })
  );

  readonly selectedPriceHistory$ = combineLatest([
    this.selectedSymbol$,
    this.marketDataService.priceHistory$,
  ]).pipe(
    map(([symbol, history]) => history[symbol.replace('/', '')] ?? [])
  );
}
