import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarketDataWs } from '@tradeforge/market-data/market-data-access';
import { OrdersApi, OrderSelectionService, OrdersEvents } from '@tradeforge/orders/order-data-access';
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
  private readonly orderSelection = inject(OrderSelectionService);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly sides = Object.values(OrderSide);
  readonly types = Object.values(OrderType);
  currentPrice: number | null = null;

  isSubmitting = false;
  private priceManuallyChanged = false;

  constructor() {
    effect(() => {
      const symbol = this.orderSelection.selectedSymbol();

      this.orderForm.controls.symbol.setValue(symbol);
    });
  }

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
    this.orderForm.controls.price.valueChanges.subscribe(() => {
      this.priceManuallyChanged = true;
    });
    this.ws.prices$().subscribe((prices) => {
      const symbol = this.orderForm.controls.symbol.value;
      const match = prices.find((p) => p.symbol === symbol);

      if (!match) {
        return;
      }

      this.currentPrice = match.price;

      if (
        this.orderForm.controls.type.value === 'LIMIT' &&
        !this.priceManuallyChanged
      ) {
        this.orderForm.controls.price.setValue(String(match.price), {
          emitEvent: false,
        });
      }
    });

    this.orderForm.controls.symbol.valueChanges.subscribe(() => {
      this.currentPrice = null;
      this.priceManuallyChanged = false;
    });

    this.orderForm.controls.type.valueChanges.subscribe((type) => {
      if (type === 'MARKET') {
        this.orderForm.controls.price.setValue('', { emitEvent: false });
        this.priceManuallyChanged = false;
      }

      if (type === 'LIMIT') {
        this.priceManuallyChanged = false;
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
    this.successMessage.set(null);
    this.errorMessage.set(null);

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
        this.successMessage.set(`${order.side} ${order.symbol} order created successfully.`);
        this.errorMessage.set(null);
        this.isSubmitting = false;

        this.ordersEvents.notifyOrderCreated();

        this.orderForm.patchValue({
          quantity: '0.01',
          price: '',
        });
      },
      error: (error) => {
        this.successMessage.set(null);
        this.errorMessage.set(this.getErrorMessage(error));
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
