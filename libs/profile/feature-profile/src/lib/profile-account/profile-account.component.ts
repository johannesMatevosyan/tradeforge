import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@tradeforge/auth-data-access';

@Component({
  selector: 'app-profile-account',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-account.component.html',
  styleUrls: ['./profile-account.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileAccountComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly user = this.authService.currentUser$;
  readonly isSaving = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

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
    if (this.form.invalid || this.isSaving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.isSaving.set(true);

    const { fullName } = this.form.getRawValue();

    this.authService.updateProfile({
      name: fullName || undefined,
    }).subscribe({
      next: () => {
        this.successMessage.set('Profile updated successfully.');
        this.isSaving.set(false);
      },
      error: (error) => {
        const message =
          error?.error?.message ?? 'Failed to update profile.';
        this.errorMessage.set(message);
        this.isSaving.set(false);
      },
    });
  }
}
