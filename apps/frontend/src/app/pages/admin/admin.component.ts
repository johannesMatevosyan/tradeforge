import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService, UserListItem } from '@tradeforge/auth-data-access';
import { UserRole } from '@tradeforge/shared-types';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
private readonly authService = inject(AuthService);

  readonly userRole = UserRole;
  readonly currentUser = this.authService.getCurrentUser();

  readonly users = signal<UserListItem[]>([]);
  readonly isLoading = signal(true);
  readonly updatingUserId = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

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
        console.error('Failed to load users', error);
        this.errorMessage.set('Failed to load users.');
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
        this.successMessage.set('User role updated successfully.');
        this.updatingUserId.set(null);
      },
      error: (error) => {
        const message =
          error?.error?.message ?? 'Failed to update user role.';
        this.errorMessage.set(message);
        this.updatingUserId.set(null);
      },
    });
  }

  isCurrentUser(userId: string): boolean {
    return this.currentUser?.id === userId;
  }
}
