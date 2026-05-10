import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MarketDataWsService, SymbolsApiService } from '@tradeforge/market-data/market-data-access';
import {
    MarketOverviewView,
    MarketRowView
} from '@tradeforge/shared-types';
import { PageHeaderComponent } from '@tradeforge/shared-ui';
import { combineLatest, debounceTime, distinctUntilChanged, map, Observable, shareReplay, startWith } from 'rxjs';

@Component({
  selector: 'markets-page.component',
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent],
  standalone: true,
  templateUrl: './markets-page.component.html',
  styleUrls: ['./markets-page.component.scss'],
})
export class MarketsPageComponent {
    private readonly symbolsApi = inject(SymbolsApiService);
    private readonly marketDataService = inject(MarketDataWsService);
    readonly searchControl = new FormControl('', { nonNullable: true });

    formatSymbol(symbol: string): string {
        if (symbol.includes('/')) {
            return symbol;
        }

        const knownQuotes = ['USD', 'USDT', 'EUR', 'BTC', 'ETH'];

        const quote = knownQuotes.find((item) => symbol.endsWith(item));

        if (!quote) {
            return symbol;
        }

        const base = symbol.slice(0, symbol.length - quote.length);

        return `${base}/${quote}`;
    }

    readonly symbols$ = this.symbolsApi.getSymbols().pipe(
        map((symbols) =>
            symbols.map((item) => ({
                symbol: item.code,
                name: item.description ?? item.code,
            }))
        ),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    readonly search$ = this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(150),
        distinctUntilChanged()
    );

    readonly markets$: Observable<MarketRowView[]> = combineLatest([
        this.symbols$,
        this.marketDataService.pricesView$,
    ]).pipe(
        map(([symbols, prices]) =>
            symbols.map((symbol) => {
                const price = prices.find(
                (item) => item.symbol === symbol.symbol.replace('/', '')
                );

                return {
                symbol: symbol.symbol,
                name: symbol.name,
                price: price?.price ?? 0,
                previousPrice: price?.previousPrice ?? null,
                direction: price?.direction ?? 'neutral',
                change: price?.previousPrice ? price.price - price.previousPrice : 0,
                changePercent: price?.previousPrice
                    ? ((price.price - price.previousPrice) / price.previousPrice) * 100
                    : 0,
                updatedAt: price?.updatedAt,
                };
            })
        )
    );

    readonly filteredMarkets$: Observable<MarketRowView[]> = combineLatest([
        this.markets$,
        this.search$,
    ]).pipe(
        map(([markets, search]) => {
            const value = search.trim().toLowerCase();
            if (!value) return markets;

            return markets.filter((market) =>
                market.symbol.toLowerCase().includes(value)
            );
        })
    );

    readonly overview$: Observable<MarketOverviewView> = this.markets$.pipe(
        map((markets) => {
        const sorted = [...markets].sort(
            (a, b) => b.changePercent - a.changePercent
        );

        return {
            totalMarkets: markets.length,
            topGainer: sorted[0] ?? null,
            topLoser: sorted[sorted.length - 1] ?? null,
            watchlistCount: null,
        };
        })
    );

    readonly topGainers$: Observable<MarketRowView[]> = this.markets$.pipe(
        map((markets) =>
        [...markets]
            .filter((market) => market.changePercent > 0)
            .sort((a, b) => b.changePercent - a.changePercent)
            .slice(0, 5)
        )
    );

    readonly topLosers$: Observable<MarketRowView[]> = this.markets$.pipe(
        map((markets) =>
        [...markets]
            .filter((market) => market.changePercent < 0)
            .sort((a, b) => a.changePercent - b.changePercent)
            .slice(0, 5)
        )
    );

    onSymbolSelected(symbol: string): void {
        // TODO: Navigate to Trading page with selected symbol.
        // Example later:
        // this.router.navigate(['/trading'], {
        //   queryParams: { symbol },
        // });
    }
}
