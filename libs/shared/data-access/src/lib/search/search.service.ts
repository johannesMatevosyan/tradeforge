import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
    private readonly _searchTerm = signal('');
    readonly searchTerm = computed(() => this._searchTerm());

    setSearchTerm(value: string): void {
        this._searchTerm.set(value);
    }

    clear(): void {
        this._searchTerm.set('');
    }
}
