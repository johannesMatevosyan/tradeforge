import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MarketDataWsService } from '@tradeforge/market-data/market-data-access';
import { OrdersApi, PositionsApi } from '@tradeforge/orders/order-data-access';
import { EmptyStateComponent, PageHeaderComponent } from '@tradeforge/shared-ui';
import { combineLatest, map } from 'rxjs';
import { buildSymbolAnalytics } from '../utils/build-symbol-analytics';
import { buildTradingActivity } from '../utils/build-trading-activity';

@Component({
  selector: 'analytics-page.component',
  imports: [CommonModule, PageHeaderComponent, EmptyStateComponent],
  standalone: true,
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss'],
})
export class AnalyticsPageComponent {
  private readonly ordersApi = inject(OrdersApi);
  private readonly positionsApi = inject(PositionsApi);
  private readonly marketDataWs = inject(MarketDataWsService);

  readonly vm$ = combineLatest([
    this.ordersApi.getOrders(),
    this.positionsApi.getPositions(),
    this.marketDataWs.pricesView$,
  ]).pipe(
    map(([orders, positions, prices]) => {
      const activity = buildTradingActivity(orders);
      const symbols = buildSymbolAnalytics(orders);

      const unrealizedPnl = positions.reduce((total, position) => {
        const livePrice =
          prices.find((price) => price.symbol === position.symbol)?.price ?? position.avgPrice;

        const pnl = (livePrice - position.avgPrice) * position.quantity;

        return total + pnl;
      }, 0);

      return {
        overview: {
          totalTrades: orders.length,
          openPositions: positions.length,
          closedPositions: 0, // mock for stage 1
          realizedPnl: 0, // mock for stage 1
          unrealizedPnl,
        },
        activity,
        symbols,
        insights: [
          {
            label: 'Most traded symbol',
            value: symbols[0]?.symbol ?? '—',
            tone: 'neutral' as const,
          },
          {
            label: 'Unrealized PnL',
            value: `$${unrealizedPnl.toFixed(2)}`,
            tone: unrealizedPnl >= 0 ? 'positive' as const : 'negative' as const,
          },
          {
            label: 'Win rate',
            value: 'Coming soon',
            tone: 'neutral' as const,
          },
        ],
      };
    })
  );
}
