import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MainShellComponent } from './main-shell';

describe('MainShellComponent', () => {
  let component: MainShellComponent;
  let fixture: ComponentFixture<MainShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainShellComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
