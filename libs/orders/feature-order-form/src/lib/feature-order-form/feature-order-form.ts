import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersApi } from '@tradeforge/orders/order-data-access';
import { CreateOrderRequest, Order, OrderSide, OrderType } from '@tradeforge/shared-types';

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

  successMessage = '';
  errorMessage = '';
  isSubmitting = false;

  orderForm = this.fb.nonNullable.group({
    symbol: ['BTCUSD', [Validators.required, Validators.minLength(3)]],
    side: ['BUY' as OrderSide, Validators.required],
    type: ['MARKET' as OrderType, Validators.required],
    quantity: ['0.01', [
      Validators.required,
      Validators.pattern(/^(?!0+(\.0+)?$)\d+(\.\d+)?$/)
    ]],
    price: [''],
  });

  get isLimitOrder(): boolean {
    return this.orderForm.controls.type.value === 'LIMIT';
  }

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const raw = this.orderForm.getRawValue();

    const payload: CreateOrderRequest = {
      symbol: raw?.symbol?.toUpperCase() || '',
      side: raw.side,
      type: raw.type,
      quantity: raw.quantity,
      ...(raw.type === 'LIMIT' ? { price: raw.price } : {}),
    };

    this.isSubmitting = true;

    this.ordersApi.createOrder(payload).subscribe({
      next: (order: Order) => {
        this.successMessage = `${order.side} ${order.symbol} order created successfully.`;
        this.errorMessage = '';
        this.isSubmitting = false;

        this.orderForm.patchValue({
          quantity: '0.01',
          price: '',
        });
      },
      error: (error) => {
        this.successMessage = '';
        this.errorMessage =
          error?.error?.message ?? 'Failed to create order.';
        this.isSubmitting = false;
      },
    });
  }
}
