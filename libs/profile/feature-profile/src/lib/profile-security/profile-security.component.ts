import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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

  readonly showCurrentPassword = signal(false);
  readonly showNewPassword = signal(false);

  readonly isSaving = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly passwordStrength = computed(() => {
    const password = this.passwordForm.controls.newPassword.value ?? '';

    if (!password) {
      return {
        label: '',
        level: '',
      };
    }

    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return { label: 'Weak', level: 'weak' };
    }

    if (score <= 4) {
      return { label: 'Medium', level: 'medium' };
    }

    return { label: 'Strong', level: 'strong' };
  });

  toggleCurrentPasswordVisibility(): void {
    this.showCurrentPassword.update((value) => !value);
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword.update((value) => !value);
  }

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
