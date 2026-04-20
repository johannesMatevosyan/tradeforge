import { Component, EventEmitter, inject, Output, Signal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, AuthUser } from '@tradeforge/auth-data-access';
import { NotificationItem, NotificationPanelComponent } from '@tradeforge/shared-ui';
import { AppIconComponent } from '@tradeforge/shared-ui-icons/app-icon';
import { SearchService } from '@tradeforge/shared/data-access';


@Component({
  selector: 'app-topbar',
  imports: [
    FormsModule,
    NotificationPanelComponent,
    AppIconComponent,
    RouterLink
  ],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss'],
  standalone: true,
})
export class TopbarComponent {
  @Output() logoutClicked = new EventEmitter<void>();
  private readonly authService = inject(AuthService);
  private readonly searchService = inject(SearchService);
  readonly searchTerm = this.searchService.searchTerm;
  readonly isNotificationsOpen = signal(false);

  readonly user$: Signal<AuthUser | null> = this.authService.currentUser$;
  isFocused = false;

  notifications: NotificationItem[] = [
    {
      id: '1',
      actorName: 'System',
      title: 'BTC price alert triggered',
      message: 'Bitcoin moved above your target price of $68,000.',
      createdAtLabel: '2 min ago',
      isRead: false,
      meta: 'BTC/USD • Alert',
    },
    {
      id: '2',
      actorName: 'TradeForge',
      title: 'Order partially filled',
      message: 'Your ETH buy order has been partially filled.',
      createdAtLabel: '15 min ago',
      isRead: true,
      meta: 'ETH/USD • Order #48392',
    },
  ];

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
}
