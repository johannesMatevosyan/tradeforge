import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureOrdersHistory } from './feature-orders-history';

describe('FeatureOrdersHistory', () => {
  let component: FeatureOrdersHistory;
  let fixture: ComponentFixture<FeatureOrdersHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureOrdersHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureOrdersHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
