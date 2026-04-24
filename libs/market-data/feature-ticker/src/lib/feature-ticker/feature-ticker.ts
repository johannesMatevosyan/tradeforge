import { AsyncPipe, CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MarketDataWs } from '@tradeforge/market-data/market-data-access';

@Component({
  selector: 'lib-feature-ticker',
  imports: [AsyncPipe, CommonModule, DecimalPipe, DatePipe],
  standalone: true,
  templateUrl: './feature-ticker.html',
  styleUrl: './feature-ticker.scss',
})
export class MarketDataFeatureTicker {
  private readonly ws = inject(MarketDataWs);
  readonly prices$ = this.ws.prices$();
}
