import { Injectable, inject } from '@angular/core';
import { MarketDataWs } from '@tradeforge/market-data/market-data-access';
import { combineLatest, map } from 'rxjs';
import { OrdersApi } from './orders.api';
import { PositionsApi } from './positions.api';

@Injectable({ providedIn: 'root' })
export class PortfolioApi {
  private positionsApi = inject(PositionsApi);
  private ordersApi = inject(OrdersApi);
  private marketWs = inject(MarketDataWs);

  readonly summary$ = combineLatest([
    this.positionsApi.getPositions(),
    this.ordersApi.getOrders(),
    this.marketWs.prices$(),
  ]).pipe(
    map(([positions, orders, prices]) => {
        let totalMarketValue = 0;
        let totalPnl = 0;

        for (const pos of positions) {
            const livePrice =
            prices.find((p) => p.symbol === pos.symbol)?.price ?? null;

            if (livePrice === null) continue;

            const value = pos.quantity * livePrice;
            const pnl = (livePrice - pos.avgPrice) * pos.quantity;

            totalMarketValue += value;
            totalPnl += pnl;
        }

        const openPositions = positions.length;
        const openOrders = orders.filter((o) => o.status === 'OPEN').length;

        return {
            totalMarketValue,
            totalPnl,
            openPositions,
            openOrders,
        };
    })
  );
}
