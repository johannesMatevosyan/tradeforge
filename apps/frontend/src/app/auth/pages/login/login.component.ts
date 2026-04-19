import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserRole } from "@tradeforge/shared-types";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    readonly errorMessage = signal<string | null>(null);
    readonly isSubmitting = signal(false);

    readonly form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    onSubmit(): void {
      if (this.form.invalid || this.isSubmitting()) {
        this.form.markAllAsTouched();
        return;
      }

      this.errorMessage.set(null);
      this.isSubmitting.set(true);

      this.authService.login(this.form.getRawValue()).subscribe({
        next: (response) => {
          const target =
            response.user.role === UserRole.ADMIN ? '/admin' : '/dashboard';

          this.router.navigateByUrl(target);
        },
        error: (error) => {
          const message =
            error?.error?.message ?? 'Login failed. Please check your credentials.';
          this.errorMessage.set(message);
          this.isSubmitting.set(false);
        },
        complete: () => {
          this.isSubmitting.set(false);
        },
      });
    }
}
