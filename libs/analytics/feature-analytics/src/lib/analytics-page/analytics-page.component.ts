import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MarketDataWsService } from '@tradeforge/market-data/market-data-access';
import { PositionsApi } from '@tradeforge/orders/order-data-access';
import { EmptyStateComponent, PageHeaderComponent } from '@tradeforge/shared-ui';
import { combineLatest, map } from 'rxjs';
import { AnalyticsApiService } from '../services/analytics-api.service';

@Component({
  selector: 'analytics-page.component',
  imports: [CommonModule, PageHeaderComponent, EmptyStateComponent],
  standalone: true,
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss'],
})
export class AnalyticsPageComponent {
  private readonly positionsApi = inject(PositionsApi);
  private readonly marketDataWs = inject(MarketDataWsService);
  private readonly analyticsApi = inject(AnalyticsApiService);

  readonly vm$ = combineLatest([
    this.analyticsApi.getOverview(),
    this.analyticsApi.getActivity(),
    this.analyticsApi.getSymbols(),
    this.positionsApi.getPositions(),
    this.marketDataWs.pricesView$,
  ]).pipe(
    map(([overview, activity, symbols, positions, prices]) => {
      const unrealizedPnl = positions.reduce((total, position) => {
        const livePrice =
          prices.find((price) => price.symbol === position.symbol)?.price ??
          position.avgPrice;

        return total + (livePrice - position.avgPrice) * position.quantity;
      }, 0);

      return {
        overview: {
          ...overview,
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
            tone: unrealizedPnl >= 0 ? ('positive' as const) : ('negative' as const),
          },
          {
            label: 'Win rate',
            value: 'Coming soon',
            tone: 'neutral' as const,
          },
        ]
      };
    })
  );
}
