import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Order } from '@tradeforge/shared-types';
import { Observable } from 'rxjs';

export interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
}

export interface ClosedPosition {
  symbol: string;
  closedQuantity: number;
  totalBuy: number;
  totalSell: number;
}

@Injectable({ providedIn: 'root' })
export class PositionsApi {
  private http = inject(HttpClient);

  getPositions(): Observable<Position[]> {
    return this.http.get<Position[]>('/api/positions');
  }

  buildClosedPositions(orders: Order[]): ClosedPosition[] {
    const filled = orders.filter(o => o.status === 'FILLED');

    const map = new Map<string, { buy: number; sell: number }>();

    for (const order of filled) {
      const current = map.get(order.symbol) ?? { buy: 0, sell: 0 };

      if (order.side === 'BUY') {
        current.buy += Number(order.quantity);
      }

      if (order.side === 'SELL') {
        current.sell += Number(order.quantity);
      }

      map.set(order.symbol, current);
    }

    return Array.from(map.entries())
      .filter(([, v]) => v.buy > 0 && v.sell > 0)
      .map(([symbol, v]) => ({
        symbol,
        closedQuantity: Math.min(v.buy, v.sell),
        totalBuy: v.buy,
        totalSell: v.sell,
      }));
  }
}
