import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketDataFeatureTicker } from './feature-ticker';

describe('MarketDataFeatureTicker', () => {
  let component: MarketDataFeatureTicker;
  let fixture: ComponentFixture<MarketDataFeatureTicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketDataFeatureTicker],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketDataFeatureTicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
