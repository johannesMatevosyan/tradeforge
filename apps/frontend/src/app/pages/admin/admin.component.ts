import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, UserListItem } from '@tradeforge/auth-data-access';
import { UserRole } from '@tradeforge/shared-types';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [DatePipe, CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly userRole = UserRole;
  readonly currentUser = this.authService.getCurrentUser();
  readonly users = signal<UserListItem[]>([]);
  readonly isLoading = signal(true);
  readonly updatingUserId = signal<string | null>(null);
  readonly isCreating = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly deletingUserId = signal<string | null>(null);
  readonly searchTerm = signal('');
  readonly roleFilter = signal<'ALL' | UserRole>('ALL');
  readonly changingStatusUserId = signal<string | null>(null);

  readonly createUserForm = this.fb.nonNullable.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: [UserRole.VIEWER as UserRole],
  });

  readonly filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const role = this.roleFilter();

    return this.users().filter((user) => {
      const matchesTerm =
        !term ||
        (user.name ?? '').toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term);

      const matchesRole =
        role === 'ALL' || user.role === role;

      return matchesTerm && matchesRole;
    });
  });

  constructor() {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.showError('Failed to load users. ' + (error?.message ? ` ${error.message}` : ''));
        this.isLoading.set(false);
      },
    });
  }

  onRoleChange(userId: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value as UserRole;
    this.changeRole(userId, value);
  }

  changeRole(userId: string, role: UserRole): void {
    const targetUser = this.users().find((user) => user.id === userId);

    if (!targetUser || targetUser.role === role) {
      return;
    }

    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.updatingUserId.set(userId);

    this.authService.updateUser(userId, { role }).subscribe({
      next: (updatedUser) => {
        this.users.update((users) =>
          users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
        );
        this.showSuccess('User role updated successfully.');
        this.updatingUserId.set(null);
      },
      error: (error) => {
        const message =
          error?.error?.message ?? 'Failed to update user role.';
        this.showError(message);
        this.updatingUserId.set(null);
      },
    });
  }

  onCreateUser(): void {
    if (this.createUserForm.invalid || this.isCreating()) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.isCreating.set(true);

    const formValue = this.createUserForm.getRawValue();

    this.authService.createUser({
      name: formValue.name || undefined,
      email: formValue.email,
      password: formValue.password,
      role: formValue.role,
    }).subscribe({
      next: (createdUser) => {
        this.users.update((users) => [createdUser, ...users]);
        this.successMessage.set('User created successfully.');
        this.isCreating.set(false);

        this.createUserForm.reset({
          name: '',
          email: '',
          password: '',
          role: UserRole.VIEWER,
        });
      },
      error: (error) => {
        let message =
          error?.error?.message ?? 'Failed to create user.';

        if (error?.status === 409) {
          message = 'A user with this email already exists.';
        } else if (error?.error?.message) {
          message = Array.isArray(error.error.message)
            ? error.error.message.join(', ')
            : error.error.message;
        }

        this.showError(message);
        this.isCreating.set(false);
      },
    });
  }

  toggleUserStatus(userId: string, isActive: boolean): void {
    const targetUser = this.users().find((user) => user.id === userId);

    if (!targetUser) {
      return;
    }

    const actionLabel = isActive ? 'activate' : 'deactivate';

    const confirmed = window.confirm(
      `${actionLabel[0].toUpperCase() + actionLabel.slice(1)} user "${targetUser.email}"?`,
    );

    if (!confirmed) {
      return;
    }

    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.changingStatusUserId.set(userId);

    this.authService.updateUserStatus(userId, { isActive }).subscribe({
      next: (updatedUser) => {
        this.users.update((users) =>
          users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
        );
      this.showSuccess(
        `User "${updatedUser.email}" has been ${isActive ? 'activated' : 'deactivated'}.`,
      );
        this.changingStatusUserId.set(null);
      },
      error: (error) => {
        const message =
          error?.error?.message ?? `Failed to ${isActive ? 'activate' : 'deactivate'} user.`;

        this.errorMessage.set(message);
        this.changingStatusUserId.set(null);
      },
    });
  }

  canDeleteUser(userId: string): boolean {
    return this.currentUser?.id !== userId;
  }

  isCurrentUser(userId: string): boolean {
    return this.currentUser?.id === userId;
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  onRoleFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as 'ALL' | UserRole;
    this.roleFilter.set(value);
  }

  private showSuccess(message: string): void {
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  private showError(message: string): void {
    this.errorMessage.set(message);
    setTimeout(() => this.errorMessage.set(null), 4000);
  }
}
