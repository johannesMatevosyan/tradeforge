import { Component } from '@angular/core';
import { MarketDataFeatureTicker } from '@tradeforge/market-data/market-feature-ticker';
import { FeatureOrderForm } from '@tradeforge/orders/feature-order-form';
import { OrdersHistory } from '@tradeforge/orders/feature-orders-history';
import { PortfolioSummary } from '@tradeforge/orders/feature-portfolio-summary';
import { PositionsComponent } from '@tradeforge/orders/feature-positions';
import { PageHeaderComponent } from '@tradeforge/shared-ui';
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
    PortfolioSummary,
    PageHeaderComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent {}
