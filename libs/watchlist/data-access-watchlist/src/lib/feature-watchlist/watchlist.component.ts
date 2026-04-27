import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { MarketDataWs } from '@tradeforge/market-data/market-data-access';
import { OrderSelectionService } from '@tradeforge/orders/order-data-access';
import { SearchService } from '@tradeforge/shared/data-access';
import { WatchlistApiService } from '../data-access-watchlist/watchlist-api.service';
import { LivePriceState, PriceDirection, WatchlistItem } from '../data-access-watchlist/watchlist-item.model';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watchlist.component.html',
    styleUrls: ['./watchlist.component.scss'],
})
export class WatchlistComponent implements OnInit {
    private readonly searchService = inject(SearchService);
    private readonly watchlistApiService = inject(WatchlistApiService);
    private readonly marketDataWs = inject(MarketDataWs);
    private readonly orderSelection = inject(OrderSelectionService);
    private readonly debugEffect = effect(() => {
        this.debugFilteredItems();
    });

    readonly items = signal<WatchlistItem[]>([]);
    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);
    readonly livePrices = signal<Record<string, LivePriceState>>({});
    readonly selectedSymbol = this.orderSelection.selectedSymbol;

    readonly searchTerm = this.searchService.searchTerm;

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

            return (
                code.includes(term) ||
                name.includes(term) ||
                label.includes(term)
            );
        });
    });

    readonly debugFilteredItems = computed(() => {
        return this.filteredItems();
    });

    getLivePrice(symbolCode: string): LivePriceState | null {
        return this.livePrices()[symbolCode] ?? null;
    }

    ngOnInit(): void {
        this.loadWatchlist();

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

    loadWatchlist(): void {
        this.isLoading.set(true);
        this.error.set(null);

        this.watchlistApiService.getWatchlist().subscribe({
            next: (items) => {
                console.log('Loaded watchlist items:', items);
                this.items.set(items);
                this.isLoading.set(false);
            },
            error: (error) => {
                this.error.set('Failed to load watchlist.');
                this.isLoading.set(false);
            },
        });
    }

    selectForOrder(symbolCode: string): void {
        this.orderSelection.selectSymbol(symbolCode);
    }
}
