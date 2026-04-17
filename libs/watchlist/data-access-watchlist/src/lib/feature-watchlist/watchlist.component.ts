import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { SearchService } from '@tradeforge/shared/data-access';
import { WatchlistApiService } from '../data-access-watchlist/watchlist-api.service';
import { WatchlistItem } from '../data-access-watchlist/watchlist-item.model';

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
    private readonly debugEffect = effect(() => {
        this.debugFilteredItems();
    });

    readonly items = signal<WatchlistItem[]>([]);
    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);

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

    ngOnInit(): void {
        this.loadWatchlist();
    }

    loadWatchlist(): void {
        this.isLoading.set(true);
        this.error.set(null);

        this.watchlistApiService.getWatchlist().subscribe({
            next: (items) => {
                this.items.set(items);
                this.isLoading.set(false);
            },
            error: (error) => {
                this.error.set('Failed to load watchlist.');
                this.isLoading.set(false);
            },
        });
    }
}
