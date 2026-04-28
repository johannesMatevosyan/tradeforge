import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TradingOrder } from '@tradeforge/shared-types';

@Component({
  selector: 'lib-place-order',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss'],
})
export class PlaceOrderComponent {
  @Input() symbol = 'BTC/USD';
  @Output() orderPlaced = new EventEmitter<TradingOrder>();

  side: 'BUY' | 'SELL' = 'BUY';
  type: 'MARKET' | 'LIMIT' = 'MARKET';
  price = 40000;
  quantity = 0.1;

  placeOrder(): void {
    if (!this.symbol.trim() || this.quantity <= 0 || this.price <= 0) {
      return;
    }

    const order: TradingOrder = {
      id: crypto.randomUUID(),
      symbol: this.symbol.trim().toUpperCase(),
      side: this.side,
      type: this.type,
      price: parseFloat((this.price * (1 + (Math.random() - 0.5) / 10)).toFixed(3)), // Simulate some price variation
      quantity: this.quantity,
      status: this.type === 'MARKET' ? 'FILLED' : 'OPEN',
      createdAt: new Date(),
    };

    this.orderPlaced.emit(order);

    this.quantity = 0.1;
  }
}
