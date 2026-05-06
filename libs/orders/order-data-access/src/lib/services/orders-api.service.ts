import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { PlaceOrderPayload, TradingOrder } from "@tradeforge/shared-types";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  private readonly http = inject(HttpClient);

  createOrder(payload: PlaceOrderPayload): Observable<TradingOrder> {
    return this.http.post<TradingOrder>('/api/orders', payload);
  }

  getOrders(): Observable<TradingOrder[]> {
    return this.http.get<TradingOrder[]>('/api/orders');
  }
}
