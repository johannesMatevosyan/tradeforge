import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Output, Signal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, AuthUser } from '@tradeforge/auth-data-access';
import { NotificationItem, NotificationService } from '@tradeforge/notifications/notification-data-access';
import { NotificationPanelComponent } from '@tradeforge/shared-ui';
import { AppIconComponent } from '@tradeforge/shared-ui-icons/app-icon';
import { SearchService } from '@tradeforge/shared/data-access';


@Component({
  selector: 'app-topbar',
  imports: [
    FormsModule,
    NotificationPanelComponent,
    AppIconComponent,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss'],
  standalone: true,
})
export class TopbarComponent {
  @Output() logoutClicked = new EventEmitter<void>();
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly searchService = inject(SearchService);
  readonly searchTerm = this.searchService.searchTerm;
  readonly unreadCount$ = this.notificationService.unreadCount$
  readonly notifications$ = this.notificationService.notifications$;
  readonly isNotificationsOpen = signal(false);

  readonly user$: Signal<AuthUser | null> = this.authService.currentUser$;
  isFocused = false;

  toggleNotifications(): void {
    this.isNotificationsOpen.update((value: boolean) => !value);
  }

  handleNotificationClick(item: NotificationItem): void {
    console.log('Open notification', item);
  }

  onSearchFocus(): void {
    this.isFocused = true;
  }

  onSearchBlur(): void {
    this.isFocused = false;
  }

  onSearchChange(value: string): void {
    this.searchService.setSearchTerm(value);
  }

  clearSearch(): void {
    this.searchService.clear();
  }

  logout(): void {
    this.logoutClicked.emit();
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }
}
