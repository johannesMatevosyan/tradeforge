import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShellFeatureLayout } from './shell-feature-layout';

describe('ShellFeatureLayout', () => {
  let component: ShellFeatureLayout;
  let fixture: ComponentFixture<ShellFeatureLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellFeatureLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellFeatureLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
