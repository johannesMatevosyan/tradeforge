import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MarketPrice } from '@tradeforge/shared-types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarketDataApi {
  private readonly http = inject(HttpClient);

  getPrices(): Observable<MarketPrice[]> {
    return this.http.get<MarketPrice[]>('/api/market-data/prices');
  }
}
