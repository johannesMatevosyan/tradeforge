import { Component } from '@angular/core';
import { WatchlistComponent } from '@tradeforge/watchlist/data-access-watchlist';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [
    WatchlistComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent {}
