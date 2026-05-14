import { inject, Injectable } from "@angular/core";
import { MarketDataWsService, MarketSymbol, SymbolsApiService } from "@tradeforge/market-data/market-data-access";
import { normalizeSymbol } from '@tradeforge/shared-utils';
import { BehaviorSubject, combineLatest, map, shareReplay, switchMap, tap } from "rxjs";
import { calculatePercentageChange } from "../../util/calculate-percentage-change";
import { WatchlistApiService } from "../services/watchlist-api.service";

@Injectable({ providedIn: 'root' })
export class WatchlistFacade {
  private readonly watchlistApiService = inject(WatchlistApiService);
  private readonly marketDataWs = inject(MarketDataWsService);
  private readonly symbolsApi = inject(SymbolsApiService);
  private readonly reload$ = new BehaviorSubject<void>(undefined);

  readonly items$ = this.reload$.pipe(
    switchMap(() => this.watchlistApiService.getWatchlist()),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly availableSymbols$ = combineLatest([
    this.symbolsApi.getSymbols(),
    this.items$,
  ]).pipe(
    map(([symbols, items]) => {
      const existingCodes = new Set(items.map((item) => item.symbolCode));

      return symbols.filter(
        (symbol) => symbol.isActive && !existingCodes.has(symbol.code)
      );
    })
  );

  readonly watchlistRows$ = combineLatest([
    this.items$,
    this.marketDataWs.pricesView$,
  ]).pipe(
    map(([items, prices]) =>
      items.map((item) => {
        const normalizedSymbol = normalizeSymbol(item.symbolCode);
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

  addSymbol(symbol: MarketSymbol) {
    const displayName =
      symbol.description ?? `${symbol.baseAsset} / ${symbol.quoteAsset}`;

    return this.watchlistApiService.addSymbol(symbol.code, displayName).pipe(
      tap(() => this.reload$.next())
    );
  }

  removeSymbol(symbol: string) {
    return this.watchlistApiService.removeSymbol(symbol).pipe(
      tap(() => this.reload$.next())
    );
  }

  removeItem(id: string) {
    return this.watchlistApiService.removeSymbol(id).pipe(
      tap(() => this.reload$.next())
    );
  }

}
