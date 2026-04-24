import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketDataDataAccess } from './data-access';

describe('MarketDataDataAccess', () => {
  let component: MarketDataDataAccess;
  let fixture: ComponentFixture<MarketDataDataAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketDataDataAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketDataDataAccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
