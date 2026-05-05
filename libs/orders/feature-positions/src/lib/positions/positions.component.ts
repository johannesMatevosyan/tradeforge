import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MarketDataWsService } from '@tradeforge/market-data/market-data-access';
import { OrdersApi, PositionsApi } from '@tradeforge/orders/order-data-access';
import { EmptyStateComponent } from '@tradeforge/shared-ui';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'lib-positions',
  imports: [AsyncPipe, DecimalPipe, EmptyStateComponent],
  standalone: true,
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss'],
})
export class PositionsComponent {
  private positionsApi = inject(PositionsApi);
  private readonly marketDataWs = inject(MarketDataWsService);
  private ordersApi = inject(OrdersApi);
  readonly closedPositions$ = this.ordersApi.getOrders().pipe(
    map((orders) => this.positionsApi.buildClosedPositions(orders))
  );

  readonly positions$ = combineLatest([
    this.positionsApi.getPositions(),
    this.marketDataWs.prices$(),
  ]).pipe(
    map(([positions, prices]) =>
      positions.map((position) => {
        const normalizedSymbol = position.symbol.replace('/', '');
        const livePrice = prices.find((p) => p.symbol === normalizedSymbol)?.price ?? null;

        const marketValue =
          livePrice !== null ? position.quantity * livePrice : null;

        const pnl =
          livePrice !== null
            ? (livePrice - position.avgPrice) * position.quantity
            : null;

        return {
          ...position,
          livePrice,
          marketValue,
          pnl,
        };
      })
    )
  );
}
