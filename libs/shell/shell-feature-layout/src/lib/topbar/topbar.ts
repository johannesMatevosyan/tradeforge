import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Output, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, TitleStrategy } from '@angular/router';
import { AuthService, AuthUser } from '@tradeforge/auth-data-access';
import { NotificationItem, NotificationService } from '@tradeforge/notifications/notification-data-access';
import { ClickOutsideDirective, NotificationPanelComponent } from '@tradeforge/shared-ui';
import { AppIconComponent } from '@tradeforge/shared-ui-icons/app-icon';
import { SearchService } from '@tradeforge/shared/data-access';
import { filter, map, startWith } from 'rxjs';


@Component({
  selector: 'app-topbar',
  imports: [
    FormsModule,
    NotificationPanelComponent,
    AppIconComponent,
    RouterLink,
    AsyncPipe,
    ClickOutsideDirective
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
  private readonly titleStrategy = inject(TitleStrategy);
  private readonly searchService = inject(SearchService);
  readonly pageTitle = signal('Dashboard');
  readonly searchTerm = this.searchService.searchTerm;
  readonly unreadCount$ = this.notificationService.unreadCount$
  readonly notifications$ = this.notificationService.notifications$;
  readonly isNotificationsOpen = signal(false);
  readonly badgeAnimationKey = signal(0);
  readonly user$: Signal<AuthUser | null> = this.authService.currentUser$;
  readonly hasUnread$ = this.unreadCount$.pipe(
    map((count) => count > 0)
  );
  readonly shouldAnimateBadge = signal(false);
  isFocused = false;

  constructor() {
    this.notificationService.loadNotifications();

    this.unreadCount$
    .pipe(takeUntilDestroyed())
    .subscribe((count) => {
      if (count > 0) {
        this.badgeAnimationKey.update((value) => value + 1);
      }
    });

    this.shouldAnimateBadge.set(false);

    setTimeout(() => {
      this.shouldAnimateBadge.set(true);
    });

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        startWith(new NavigationEnd(0, this.router.url, this.router.url)),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.pageTitle.set(this.getCurrentPageTitle());
      });

  }

  private getCurrentPageTitle(): string {
    return this.titleStrategy.buildTitle(this.router.routerState.snapshot) ?? 'Dashboard';
  }

  toggleNotifications(): void {
    this.isNotificationsOpen.update((value: boolean) => !value);
  }

  handleNotificationClick(item: NotificationItem): void {
    this.isNotificationsOpen.set(false);
    this.notificationService.markAsRead(item.id);
    this.router.navigate(['/notifications', item.id]);
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
