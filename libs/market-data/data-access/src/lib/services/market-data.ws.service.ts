import { Injectable } from '@angular/core';
import { MarketPrice, MarketPriceView } from '@tradeforge/shared-types';
import { map, Observable, pairwise, scan } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class MarketDataWsService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  prices$(): Observable<MarketPrice[]> {
    return new Observable((observer) => {
      this.socket.on('prices', (data: MarketPrice[]) => {
        observer.next(data);
      });

      return () => {
        this.socket.off('prices');
      };
    });
  }

  pricesView$ = this.prices$().pipe(
    pairwise(),
    map(([previous, current]) => {
      const previousMap = this.toPriceMap(previous);

      return current.map((item) => {
        const previousPrice = previousMap[item.symbol] ?? null;

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
          direction
        };
      });
    })
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
