import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MarketDataWsService } from '@tradeforge/market-data/market-data-access';
import { TradingOrder, TradingPosition } from '@tradeforge/shared-types';
import { TradingOrdersService } from '@tradeforge/trading/trading-data-access';
import { combineLatest, map } from 'rxjs';
import { PositionsTableComponent } from '../positions-table/positions-table.component';

@Component({
  selector: 'lib-portfolio-page',
  imports: [CommonModule, PositionsTableComponent],
  standalone: true,
  templateUrl: './portfolio-page.component.html',
  styleUrls: ['./portfolio-page.component.scss'],
})
export class PortfolioPageComponent {
  private readonly ordersService = inject(TradingOrdersService);
  private readonly marketDataService = inject(MarketDataWsService);
  readonly orders$ = this.ordersService.orders$;
  readonly pricesMap$ = this.marketDataService.pricesMap$;

  getPositions(orders: TradingOrder[]): TradingPosition[] {
    return this.ordersService.getPositions(orders);
  }

  readonly positionsView$ = combineLatest([
    this.orders$,
    this.pricesMap$
  ]).pipe(
    map(([orders, prices]) => {
      const positions = this.ordersService.getPositions(orders);
      return this.ordersService.enrichPositionsWithPrices(
        positions,
        prices
      );
    })
  )

}
