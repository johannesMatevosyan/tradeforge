import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  template: '',
})
class WatchlistStubComponent {}

@Component({
  selector: 'lib-feature-ticker',
  standalone: true,
  template: '',
})
class TickerStubComponent {}

@Component({
  selector: 'lib-feature-order-form',
  standalone: true,
  template: '',
})
class OrderFormStubComponent {}

@Component({
  selector: 'lib-orders-history',
  standalone: true,
  template: '',
})
class OrdersHistoryStubComponent {}

@Component({
  selector: 'lib-positions',
  standalone: true,
  template: '',
})
class PositionsStubComponent {}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    TestBed.overrideComponent(DashboardComponent, {
      set: {
        imports: [
          WatchlistStubComponent,
          TickerStubComponent,
          OrderFormStubComponent,
          OrdersHistoryStubComponent,
          PositionsStubComponent,
        ],
      },
    });

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
