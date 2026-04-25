import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarketDataWs } from '@tradeforge/market-data/market-data-access';
import { OrdersApi, OrdersEvents } from '@tradeforge/orders/order-data-access';
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
  private ws = inject(MarketDataWs);
  private ordersEvents = inject(OrdersEvents);
  readonly sides = Object.values(OrderSide);
  readonly types = Object.values(OrderType);
  currentPrice: number | null = null;

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

  ngOnInit() {
    this.ws.prices$().subscribe((prices) => {
      const symbol = this.orderForm.controls.symbol.value;

      const match = prices.find((p) => p.symbol === symbol);

      if (match) {
        this.currentPrice = match.price;

        if (this.orderForm.controls.type.value === 'LIMIT') {
          this.orderForm.controls.price.setValue(String(match.price));
        }
      }
    });

    this.orderForm.controls.symbol.valueChanges.subscribe(() => {
      this.currentPrice = null; // reset until next WS tick
    });
    this.orderForm.controls.type.valueChanges.subscribe((type) => {
      if (type === 'MARKET') {
        this.orderForm.controls.price.setValue('');
      }
    });
  }

  get isLimitOrder(): boolean {
    return this.orderForm.controls.type.value === 'LIMIT';
  }

  get isMarketOrder(): boolean {
    return this.orderForm.controls.type.value === 'MARKET';
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

        this.ordersEvents.notifyOrderCreated();

        this.orderForm.patchValue({
          quantity: '0.01',
          price: '',
        });
      },
      error: (error) => {
        this.successMessage = '';
        this.errorMessage = this.getErrorMessage(error);
        this.isSubmitting = false;
      },
    });
  }


  private getErrorMessage(error: unknown): string {
    const fallback = 'Failed to place order. Please try again.';

    if (
      typeof error === 'object' &&
      error !== null &&
      'error' in error
    ) {
      const httpError = error as {
        error?: {
          message?: string | string[];
          statusCode?: number;
        };
      };

      const message = httpError.error?.message;

      if (Array.isArray(message)) {
        return message[0] ?? fallback;
      }

      if (typeof message === 'string') {
        return message;
      }
    }

    return fallback;
  }
}
