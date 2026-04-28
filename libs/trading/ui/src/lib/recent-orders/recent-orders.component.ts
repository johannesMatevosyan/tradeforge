import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'lib-recent-orders',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './recent-orders.component.html',
  styleUrls: ['./recent-orders.component.scss'],
})
export class RecentOrdersComponent {
  orders = signal([
    { id: 1, symbol: 'BTC/USD', type: 'BUY', price: 43000, status: 'FILLED' },
    { id: 2, symbol: 'ETH/USD', type: 'SELL', price: 2200, status: 'OPEN' },
    { id: 3, symbol: 'SOL/USD', type: 'BUY', price: 95, status: 'CANCELLED' },
    { id: 4, symbol: 'BNB/USD', type: 'SELL', price: 310, status: 'FILLED' },
  ]);
}
