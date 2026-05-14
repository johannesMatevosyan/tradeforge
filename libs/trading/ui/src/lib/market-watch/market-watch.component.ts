import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MarketPriceView } from '@tradeforge/shared-types';
import { normalizeSymbol } from '@tradeforge/shared-utils';

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
  @Input() prices: MarketPriceView[] = [];
  @Output() symbolSelected = new EventEmitter<string>();

  getPrice(symbol: string): MarketPriceView | undefined {
    const normalizedSymbol = normalizeSymbol(symbol);

    return this.prices.find((item) => item.symbol === normalizedSymbol);
  }
}
