import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppIconComponent } from './app-icon';

describe('AppIcon', () => {
  let component: AppIconComponent;
  let fixture: ComponentFixture<AppIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppIconComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
