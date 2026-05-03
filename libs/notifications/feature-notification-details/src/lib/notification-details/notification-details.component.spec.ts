import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationDetailsComponent } from '../notification-details.component';

describe('NotificationDetailsComponent', () => {
  let component: NotificationDetailsComponent;
  let fixture: ComponentFixture<NotificationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
