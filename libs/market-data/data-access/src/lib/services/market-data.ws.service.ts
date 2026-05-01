import { Injectable } from '@angular/core';
import { MarketPrice } from '@tradeforge/shared-types';
import { map, Observable } from 'rxjs';
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

  pricesMap$ = this.prices$().pipe(
    map((prices) => {
      const map: Record<string, number> = {};

      for (const item of prices) {
        map[item.symbol] = item.price;
      }

      return map;
    })
  );
}
