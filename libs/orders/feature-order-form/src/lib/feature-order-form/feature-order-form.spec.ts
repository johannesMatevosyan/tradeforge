import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureOrderForm } from './feature-order-form';

describe('FeatureOrderForm', () => {
  let component: FeatureOrderForm;
  let fixture: ComponentFixture<FeatureOrderForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureOrderForm],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureOrderForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
