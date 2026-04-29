import { Component, inject } from '@angular/core';
import { TradingOrder, TradingPosition } from '@tradeforge/shared-types';
import { TradingOrdersService } from '@tradeforge/trading/trading-data-access';

@Component({
  selector: 'lib-portfolio-page',
  imports: [],
  standalone: true,
  templateUrl: './portfolio-page.component.html',
  styleUrl: './portfolio-page.component.scss',
})
export class PortfolioPageComponent {
  private readonly ordersService = inject(TradingOrdersService);
  readonly orders$ = this.ordersService.orders$;

  getPositions(orders: TradingOrder[]): TradingPosition[] {
    return this.ordersService.getPositions(orders);
  }
}
