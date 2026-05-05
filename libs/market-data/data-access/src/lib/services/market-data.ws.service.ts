import { Injectable } from '@angular/core';
import { MarketPrice, MarketPriceView } from '@tradeforge/shared-types';
import { map, Observable, scan, shareReplay } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class MarketDataWsService {
  private socket: Socket;

  private readonly pricesStream$ = new Observable<MarketPrice[]>((observer) => {
    this.socket.on('prices', (data: MarketPrice[]) => {
      observer.next(data);
    });

    return () => {
      this.socket.off('prices');
    };
  }).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  prices$(): Observable<MarketPrice[]> {
    return this.pricesStream$;
  }

  pricesView$ = this.prices$().pipe(
    scan(
      (state, current) => {
        const nextPriceMap = this.toPriceMap(current);
        const nextUpdatedAtMap = { ...state.updatedAtMap };
        const now = Date.now();

        const pricesView = current.map((item) => {
          const previousPrice = state.priceMap[item.symbol] ?? null;
          const priceChanged = previousPrice === null || item.price !== previousPrice;
          const updatedAt = priceChanged
            ? now
            : nextUpdatedAtMap[item.symbol] ?? now;

          nextUpdatedAtMap[item.symbol] = updatedAt;

          const direction: MarketPriceView['direction'] =
            previousPrice === null
              ? 'neutral'
              : item.price > previousPrice
                ? 'up'
                : item.price < previousPrice
                  ? 'down'
                  : 'neutral';

          return {
            symbol: item.symbol,
            price: item.price,
            previousPrice,
            direction,
            updatedAt,
          };
        });

        return {
          priceMap: nextPriceMap,
          updatedAtMap: nextUpdatedAtMap,
          pricesView,
        };
      },
      {
        priceMap: {} as Record<string, number>,
        updatedAtMap: {} as Record<string, number>,
        pricesView: [] as MarketPriceView[],
      }
    ),
    map((state) => state.pricesView)
  );

  pricesMap$ = this.prices$().pipe(
    map((prices) => {
      const map: Record<string, number> = {};

      for (const item of prices) {
        map[item.symbol] = item.price;
      }

      return map;
    })
  );

  priceHistory$ = this.pricesView$.pipe(
    scan((history, prices) => {
      const updated = { ...history };

      for (const item of prices) {
        const current = updated[item.symbol] ?? [];

        updated[item.symbol] = [
          ...current,
          item.price,
        ].slice(-50);
      }

      return updated;
    }, {} as Record<string, number[]>)
  );

  private toPriceMap(prices: MarketPrice[]): Record<string, number> {
    return prices.reduce((acc, item) => {
      acc[item.symbol] = item.price;
      return acc;
    }, {} as Record<string, number>);
  }
}
