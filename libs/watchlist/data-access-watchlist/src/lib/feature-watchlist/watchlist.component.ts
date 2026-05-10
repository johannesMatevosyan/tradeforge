import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MarketDataWsService, MarketSymbol } from '@tradeforge/market-data/market-data-access';
import { OrderSelectionService } from '@tradeforge/orders/order-data-access';
import { PageHeaderComponent } from '@tradeforge/shared-ui';
import { SearchService } from '@tradeforge/shared/data-access';
import { WatchlistFacade } from '../..';
import { LivePriceState, PriceDirection } from '../data-access-watchlist/models/watchlist-item.model';
import { WatchlistApiService } from '../data-access-watchlist/services/watchlist-api.service';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './watchlist.component.html',
    styleUrls: ['./watchlist.component.scss'],
})
export class WatchlistComponent implements OnInit {
    private readonly searchService = inject(SearchService);
    private readonly watchlistApiService = inject(WatchlistApiService);
    private readonly marketDataWs = inject(MarketDataWsService);
    private readonly orderSelection = inject(OrderSelectionService);
    private readonly watchlistFacade = inject(WatchlistFacade);

    readonly selectedSymbolToAdd = signal('');
    readonly availableSymbols = toSignal(
        this.watchlistFacade.availableSymbols$,
        { initialValue: [] }
    );
    // readonly items = signal<WatchlistItem[]>([]);
    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);
    readonly livePrices = signal<Record<string, LivePriceState>>({});
    readonly selectedSymbol = this.orderSelection.selectedSymbol;

    readonly items = toSignal(this.watchlistFacade.items$, {
        initialValue: [],
    });

    readonly searchTerm = signal('');

    readonly filteredItems = computed(() => {
        const term = this.searchTerm().toLowerCase().trim();
        const items = this.items();

        if (!term) {
            return items;
        }

        return items.filter((item) => {
            const code = item.symbolCode.toLowerCase();
            const name = item.displayName.toLowerCase();
            const label = item.label.toLowerCase();

            return code.includes(term) || name.includes(term) || label.includes(term);
        });
    });

    getLivePrice(symbolCode: string): LivePriceState | null {
        return this.livePrices()[symbolCode] ?? null;
    }

    ngOnInit(): void {

        this.marketDataWs.prices$().subscribe((prices) => {
            this.livePrices.update((previous) => {
            const next = { ...previous };

            for (const item of prices) {
                const previousPrice = previous[item.symbol]?.price;

                const direction: PriceDirection =
                previousPrice === undefined
                    ? 'flat'
                    : item.price > previousPrice
                    ? 'up'
                    : item.price < previousPrice
                        ? 'down'
                        : 'flat';

                next[item.symbol] = {
                    price: item.price,
                    direction,
                };
            }

                return next;
            });
        });
    }

    selectForOrder(symbolCode: string): void {
        this.orderSelection.selectSymbol(symbolCode);
    }

    removeItem(id: string): void {
        this.watchlistFacade.removeItem(id).subscribe({
            error: (error) => {
                console.error('Failed to remove watchlist item', error);
            },
        });
    }

    onSymbolToAddChanged(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        this.selectedSymbolToAdd.set(value);
    }

    addSelectedSymbol(): void {
        const symbolCode = this.selectedSymbolToAdd();
        const symbol = this.availableSymbols().find(
            (item) => item.code === symbolCode
        );

        if (!symbolCode) {
            return;
        }

        if (!symbol) {
            return;
        }

        this.watchlistFacade.addSymbol(symbol).subscribe(() => {
            this.selectedSymbolToAdd.set('');
        });
    }

    getSymbolLabel(symbol: MarketSymbol): string {
        return `${symbol.code} - ${symbol.description ?? `${symbol.baseAsset} / ${symbol.quoteAsset}`}`;
    }
}
