import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TradingOrdersService } from '@tradeforge/trading/trading-data-access';


@Component({
  selector: 'lib-orders-page',
  imports: [AsyncPipe, CommonModule],
  standalone: true,
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss'],
})
export class OrdersPageComponent {
  private readonly ordersService = inject(TradingOrdersService);

  readonly orders$ = this.ordersService.orders$;
}
