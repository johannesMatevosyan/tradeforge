import { Component } from '@angular/core';
import { MarketDataFeatureTicker } from '@tradeforge/market-data/market-feature-ticker';
import { FeatureOrderForm } from '@tradeforge/orders/feature-order-form';
import { OrdersHistory } from '@tradeforge/orders/feature-orders-history';
import { PositionsComponent } from '@tradeforge/orders/feature-positions';
import { WatchlistComponent } from '@tradeforge/watchlist/data-access-watchlist';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [
    WatchlistComponent,
    MarketDataFeatureTicker,
    FeatureOrderForm,
    OrdersHistory,
    PositionsComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent {}
