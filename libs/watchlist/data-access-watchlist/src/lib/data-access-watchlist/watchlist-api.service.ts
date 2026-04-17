import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { WatchlistItem } from './watchlist-item.model';

@Injectable({
  providedIn: 'root',
})
export class WatchlistApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = '/api/watchlist';

    getWatchlist(): Observable<WatchlistItem[]> {
        return this.http.get<WatchlistItem[]>(this.baseUrl);
    }
}
