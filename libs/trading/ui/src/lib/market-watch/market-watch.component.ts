import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MarketPriceView } from 'libs/shared-types/src/lib/market/market-price-view.model';

@Component({
  selector: 'lib-market-watch',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './market-watch.component.html',
  styleUrls: ['./market-watch.component.scss'],
})
export class MarketWatchComponent {
  @Input() selectedSymbol = 'BTC/USD';
  @Input() symbols: { symbol: string; name: string }[] = [];
  @Input() direction: 'up' | 'down' | 'neutral' = 'neutral';
  @Input() prices: MarketPriceView[] = [];
  @Output() symbolSelected = new EventEmitter<string>();

  getPrice(symbol: string): MarketPriceView | undefined {
    return this.prices.find((item) => item.symbol === symbol);
  }
}
