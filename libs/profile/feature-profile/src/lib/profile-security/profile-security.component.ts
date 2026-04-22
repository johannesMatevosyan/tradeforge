import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '@tradeforge/auth-data-access';

@Component({
  selector: 'app-profile-security',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-security.component.html',
  styleUrl: './profile-security.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSecurityComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly isSaving = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.passwordForm.invalid || this.isSaving()) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.isSaving.set(true);

    this.authService.updatePassword(this.passwordForm.getRawValue()).subscribe({
      next: () => {
        this.successMessage.set('Password updated successfully.');
        this.passwordForm.reset();
        this.isSaving.set(false);
      },
      error: (error) => {
        const message =
          error?.error?.message ?? 'Failed to update password.';
        this.errorMessage.set(message);
        this.isSaving.set(false);
      },
    });
  }
}
