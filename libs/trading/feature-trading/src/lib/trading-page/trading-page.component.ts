import { Component } from '@angular/core';
import { ChartComponent, RecentOrdersComponent } from '@tradeforge/trading/ui';

@Component({
  selector: 'lib-trading-page',
  imports: [ChartComponent, RecentOrdersComponent],
  standalone: true,
  templateUrl: './trading-page.component.html',
  styleUrls: ['./trading-page.component.scss'],
})
export class TradingPageComponent {
  selectedSymbol: string = 'BTC/USD';
  currentPrice: number = 43250;
}
