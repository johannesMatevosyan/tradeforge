import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderSelectionService {
  readonly selectedSymbol = signal('BTCUSD');

  selectSymbol(symbol: string): void {
    this.selectedSymbol.set(symbol);
  }
}
