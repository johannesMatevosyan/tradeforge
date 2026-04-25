import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersEvents {
  private readonly orderCreatedSubject = new Subject<void>();

  readonly orderCreated$ = this.orderCreatedSubject.asObservable();

  notifyOrderCreated(): void {
    this.orderCreatedSubject.next();
  }
}
