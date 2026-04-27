import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TradingPageComponent } from './trading-page.component';

describe('TradingPageComponent', () => {
  let component: TradingPageComponent;
  let fixture: ComponentFixture<TradingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TradingPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
