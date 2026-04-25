import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CreateOrderRequest, Order } from '@tradeforge/shared-types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersApi {
  private http = inject(HttpClient);

  createOrder(payload: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>('/api/orders', payload);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>('/api/orders');
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`/api/orders/${id}`);
  }

  cancelOrder(id: string): Observable<Order> {
    return this.http.post<Order>(`/api/orders/${id}/cancel`, {});
  }
}
