import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TradingSymbolsService {
  private selectedSymbolSubject = new BehaviorSubject<string>('BTC/USD');

  selectedSymbol$ = this.selectedSymbolSubject.asObservable();

  symbols = [
    { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar' },
    { symbol: 'ETH/USD', name: 'Ethereum / US Dollar' },
    { symbol: 'XAU/USD', name: 'Gold / US Dollar' },
  ];

  selectSymbol(symbol: string): void {
    this.selectedSymbolSubject.next(symbol);
  }
}
