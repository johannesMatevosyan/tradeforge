import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TradingOrder } from '@tradeforge/shared-types';
import { TradingOrdersService } from '@tradeforge/trading/trading-data-access';
import { OrdersTableComponent } from '../orders-table/orders-table.component';


@Component({
  selector: 'lib-orders-page',
  imports: [AsyncPipe, CommonModule, OrdersTableComponent, FormsModule],
  standalone: true,
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss'],
})
export class OrdersPageComponent {
  private readonly ordersService = inject(TradingOrdersService);
  filterSymbol = '';
  filterStatus = 'ALL';
  filterSide = 'ALL';
  filterType = 'ALL';

  readonly orders$ = this.ordersService.orders$;

  getTotalOrders(orders: TradingOrder[]): number {
    return orders.length;
  }

  getOpenOrders(orders: TradingOrder[]): number {
    return orders.filter((order) => order.status === 'OPEN').length;
  }

  getFilledOrders(orders: TradingOrder[]): number {
    return orders.filter((order) => order.status === 'FILLED').length;
  }

  getCancelledOrders(orders: TradingOrder[]): number {
    return orders.filter((order) => order.status === 'CANCELLED').length;
  }

  filterOrders(orders: TradingOrder[]): TradingOrder[] {
    return orders.filter((order) => {
      const matchesSymbol =
        !this.filterSymbol ||
        order.symbol.toLowerCase().includes(this.filterSymbol.toLowerCase());

      const matchesStatus =
        this.filterStatus === 'ALL' || order.status === this.filterStatus;

      const matchesSide =
        this.filterSide === 'ALL' || order.side === this.filterSide;

      const matchesType =
        this.filterType === 'ALL' || order.type === this.filterType;

      return matchesSymbol && matchesStatus && matchesSide && matchesType;
    });
  }
}
