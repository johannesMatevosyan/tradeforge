import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { DEFAULT_SYMBOL, normalizeSymbol } from '@tradeforge/shared-utils';

@Injectable({
  providedIn: 'root',
})
export class OrderSelectionService {
  readonly SELECTED_SYMBOL_STORAGE_KEY = 'tradeforge_selected_symbol';
  readonly selectedSymbol = signal(
    localStorage.getItem(this.SELECTED_SYMBOL_STORAGE_KEY) ?? DEFAULT_SYMBOL
  );

  readonly selectedSymbol$ = toObservable(this.selectedSymbol);

  selectSymbol(symbol: string): void {
    const normalizedSymbol = normalizeSymbol(symbol);

    this.selectedSymbol.set(normalizedSymbol);
    localStorage.setItem(this.SELECTED_SYMBOL_STORAGE_KEY, normalizedSymbol);
  }
}
