import { Component } from '@angular/core';
import { ChartComponent } from '@tradeforge/trading/ui';

@Component({
  selector: 'lib-trading-page',
  imports: [ChartComponent],
  standalone: true,
  templateUrl: './trading-page.component.html',
  styleUrls: ['./trading-page.component.scss'],
})
export class TradingPageComponent {
  selectedSymbol: string = 'BTC/USD';
  currentPrice: number = 43250;
}
