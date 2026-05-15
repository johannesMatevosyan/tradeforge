import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MarketDataWsService } from '@tradeforge/market-data/market-data-access';
import { NotificationService } from '@tradeforge/notifications/notification-data-access';
import { OrdersApiService, OrderSelectionService } from '@tradeforge/orders/order-data-access';
import { PlaceOrderPayload, TradingOrder } from '@tradeforge/shared-types';
import { PageHeaderComponent } from '@tradeforge/shared-ui';
import { formatSymbolValue, normalizeSymbol } from '@tradeforge/shared-utils';
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
export class TradingPageComponent implements OnInit {
  private readonly ordersService = inject(TradingOrdersService);
  private readonly symbolsService = inject(TradingSymbolsService);
  private readonly notificationService = inject(NotificationService);
  private readonly ordersApiervice = inject(OrdersApiService);
  private readonly marketDataService = inject(MarketDataWsService);
  private readonly orderSelection = inject(OrderSelectionService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef)
  readonly pricesMap$ = this.marketDataService.pricesMap$;
  readonly pricesView$ = this.marketDataService.pricesView$;
  defaultSymbol = 'BTCUSD'
  formatSymbolValue = formatSymbolValue;

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

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const symbol = params?.get('symbol');
console.log('Query param symbol:', symbol);
        if (symbol) {
          this.orderSelection.selectSymbol(formatSymbolValue(symbol));
        }
      });
  }

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
      const normalizedSymbol = normalizeSymbol(symbol);

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


