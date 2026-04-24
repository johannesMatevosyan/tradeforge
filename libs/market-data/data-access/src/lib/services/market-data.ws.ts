import { Injectable } from '@angular/core';
import { MarketPrice } from '@tradeforge/shared-types';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class MarketDataWs {
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
}
