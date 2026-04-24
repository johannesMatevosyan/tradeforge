import { Component } from '@angular/core';
import { MarketDataFeatureTicker } from '@tradeforge/market-data/market-feature-ticker';
import { WatchlistComponent } from '@tradeforge/watchlist/data-access-watchlist';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [
    WatchlistComponent,
    MarketDataFeatureTicker
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent {}
