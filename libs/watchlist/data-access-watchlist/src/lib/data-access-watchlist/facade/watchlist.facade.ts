import { inject, Injectable } from "@angular/core";
import { MarketDataWsService } from "@tradeforge/market-data/market-data-access";
import { BehaviorSubject, combineLatest, map, shareReplay, switchMap, tap } from "rxjs";
import { calculatePercentageChange } from "../../util/calculate-percentage-change";
import { WatchlistApiService } from "../services/watchlist-api.service";

@Injectable({ providedIn: 'root' })
export class WatchlistFacade {
  private readonly watchlistApiService = inject(WatchlistApiService);
  private readonly marketDataWs = inject(MarketDataWsService);

  private readonly reload$ = new BehaviorSubject<void>(undefined);

  readonly items$ = this.reload$.pipe(
    switchMap(() => this.watchlistApiService.getWatchlist()),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly watchlistRows$ = combineLatest([
    this.items$,
    this.marketDataWs.pricesView$,
  ]).pipe(
    map(([items, prices]) =>
      items.map((item) => {
        const normalizedSymbol = item.symbolCode.replace('/', '');

        const price = prices.find(
          (priceItem) => priceItem.symbol === normalizedSymbol
        );

        return {
          id: item.id,
          symbolCode: item.symbolCode,
          displayName: item.displayName,
          label: item.label,
          isActive: item.isActive,

          price: price?.price ?? 0,
          previousPrice: price?.previousPrice ?? null,
          direction: price?.direction ?? 'neutral',
          percentageChange: calculatePercentageChange(
            price?.previousPrice,
            price?.price
          ),
        };
      })
    )
  );

  addSymbol(symbol: string) {
    return this.watchlistApiService.addSymbol(symbol).pipe(
      tap(() => this.reload$.next())
    );
  }

  removeSymbol(symbol: string) {
    return this.watchlistApiService.removeSymbol(symbol).pipe(
      tap(() => this.reload$.next())
    );
  }
}
