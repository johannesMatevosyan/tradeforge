import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlaceOrderPayload } from "@tradeforge/shared-types";

@Component({
  selector: 'lib-place-order',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss'],
})
export class PlaceOrderComponent {
  @Input() symbol = 'BTC/USD';
  @Input() price: number = 0;
  @Output() orderPlaced = new EventEmitter<PlaceOrderPayload>();

  side: 'BUY' | 'SELL' = 'BUY';
  type: 'MARKET' | 'LIMIT' = 'MARKET';
  quantity = '0.1';

  placeOrder(): void {
    if (!this.symbol.trim() || !this.quantity || parseFloat(this.quantity) <= 0) {
      return;
    }

    if (this.type === 'LIMIT' && this.price <= 0) {
      return;
    }

    this.orderPlaced.emit({
      symbol: this.symbol.trim().toUpperCase(),
      side: this.side,
      type: this.type,
      quantity: String(this.quantity),
      price: this.type === 'LIMIT' ? String(this.price) : '',
    });

    this.quantity = '0.1';
  }

  get isPlaceOrderDisabled(): boolean {
    return (
      !this.symbol.trim() ||
      Number(this.quantity) <= 0 ||
      (this.type === 'LIMIT' && Number(this.price) <= 0)
    );
  }
}
