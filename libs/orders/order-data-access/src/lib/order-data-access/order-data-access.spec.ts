import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderDataAccess } from './order-data-access';

describe('OrderDataAccess', () => {
  let component: OrderDataAccess;
  let fixture: ComponentFixture<OrderDataAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDataAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDataAccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
