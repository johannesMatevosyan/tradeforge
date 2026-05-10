import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { WatchlistItemResponse } from '../models/watchlist-item-response.model';
import { WatchlistItem } from '../models/watchlist-item.model';

@Injectable({
  providedIn: 'root',
})
export class WatchlistApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = '/api/watchlist';

    getWatchlist(): Observable<WatchlistItem[]> {
        return this.http.get<WatchlistItem[]>(this.baseUrl);
    }

    addSymbol(symbolCode: string, displayName: string) {
        return this.http.post<WatchlistItemResponse>('/api/watchlist', { symbolCode, displayName });
    }

    removeSymbol(symbol: string) {
        return this.http.delete<void>(`/api/watchlist/${encodeURIComponent(symbol)}`);
    }
}
