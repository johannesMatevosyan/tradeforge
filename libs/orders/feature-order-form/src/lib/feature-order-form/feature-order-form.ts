import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersApi } from '@tradeforge/orders/order-data-access';
import { OrderSide, OrderType } from '@tradeforge/shared-types';

@Component({
  selector: 'lib-feature-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './feature-order-form.html',
  styleUrls: ['./feature-order-form.scss'],
})
export class FeatureOrderForm {
  private fb = inject(FormBuilder);
  private ordersApi = inject(OrdersApi);

  readonly sides = Object.values(OrderSide);
  readonly types = Object.values(OrderType);

  orderForm = this.fb.group({
    symbol: ['', [Validators.required, Validators.minLength(3)]],
    side: [OrderSide.BUY, Validators.required],
    type: [OrderType.MARKET, Validators.required],
    quantity: ['', [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
    price: [''],
  });

  get isLimit(): boolean {
    return this.orderForm.get('type')?.value === OrderType.LIMIT;
  }

  submit():void {
    if (this.orderForm.invalid) return;

    const payload = this.orderForm.value;

    this.ordersApi.createOrder(payload).subscribe({
      next: (res) => {
        console.log('Order created', res);
        this.orderForm.reset({
          side: OrderSide.BUY,
          type: OrderType.MARKET,
        });
      },
      error: (err) => {
        console.error('Order failed', err);
      },
    });
  }
}
