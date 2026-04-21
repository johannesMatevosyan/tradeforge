import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@tradeforge/auth-data-access';

@Component({
  selector: 'app-profile-account',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-account.html',
  styleUrls: ['./profile-account.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileAccountComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly user = this.authService.currentUser$;

  readonly form = this.fb.nonNullable.group({
    fullName: [''],
    email: ['']
  });

  constructor() {
    effect(() => {
      const user = this.user();
      if (!user) return;

      this.form.patchValue({
        fullName: user.name ?? '',
        email: user.email ?? '',
      });
    });
  }

  onSubmit(): void {
    const value = this.form.getRawValue();

    console.log('Save profile:', value);

    // next step: call backend update endpoint
  }
}
