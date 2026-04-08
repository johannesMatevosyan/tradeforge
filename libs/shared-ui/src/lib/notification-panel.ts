import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';

export interface NotificationItem {
  id: string;
  actorName: string;
  actorAvatarUrl?: string;
  title: string;
  message: string;
  createdAtLabel: string;
  isRead: boolean;
  meta?: string;
  route?: string;
}

type NotificationFilter = 'all' | 'unread';

@Component({
  selector: 'app-notification-panel',
  imports: [],
  templateUrl: './notification-panel.html',
  styleUrl: './notification-panel.scss',
})
export class NotificationPanelComponent {
    @Input({ required: true }) notifications: NotificationItem[] = [];
  @Output() notificationClick = new EventEmitter<NotificationItem>();
  @Output() unreadOnlyChange = new EventEmitter<boolean>();

  readonly activeFilter = signal<NotificationFilter>('all');
  readonly unreadOnly = signal(false);

  readonly visibleNotifications = computed(() => {
    const unreadOnly = this.unreadOnly();
    const activeFilter = this.activeFilter();

    return this.notifications.filter((item) => {
      if (unreadOnly) {
        return !item.isRead;
      }

      if (activeFilter === 'unread') {
        return !item.isRead;
      }

      return true;
    });
  });

  readonly unreadCount = computed(
    () => this.notifications.filter((item) => !item.isRead).length
  );

  setFilter(filter: NotificationFilter): void {
    this.activeFilter.set(filter);
  }

  toggleUnreadOnly(): void {
    const nextValue = !this.unreadOnly();
    this.unreadOnly.set(nextValue);
    this.unreadOnlyChange.emit(nextValue);
  }

  onNotificationClick(item: NotificationItem): void {
    this.notificationClick.emit(item);
  }

  trackById(_: number, item: NotificationItem): string {
    return item.id;
  }
}
