import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersApi, OrdersEvents } from '@tradeforge/orders/order-data-access';
import { of, Subject } from 'rxjs';
import { OrdersHistory } from './orders-history';

describe('OrdersHistory', () => {
  let component: OrdersHistory;
  let fixture: ComponentFixture<OrdersHistory>;
  let orderCreatedSubject: Subject<void>;

  beforeEach(async () => {
    orderCreatedSubject = new Subject<void>();

    await TestBed.configureTestingModule({
      imports: [OrdersHistory],
      providers: [
        {
          provide: OrdersApi,
          useValue: {
            getOrders: jest.fn(() => of([])),
          },
        },
        {
          provide: OrdersEvents,
          useValue: {
            orderCreated$: orderCreatedSubject.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
