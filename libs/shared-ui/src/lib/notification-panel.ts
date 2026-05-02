import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NotificationItem, NotificationService } from '@tradeforge/notifications/notification-data-access';

type NotificationFilter = 'all' | 'unread';

@Component({
  selector: 'app-notification-panel',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './notification-panel.html',
  styleUrls: ['./notification-panel.scss'],
})
export class NotificationPanelComponent {
  @Input({ required: true }) notifications: NotificationItem[] = [];
  @Output() notificationClick = new EventEmitter<NotificationItem>();

  private readonly notificationService = inject(NotificationService);

  readonly unreadCount$ = this.notificationService.unreadCount$;

  selectedFilter: NotificationFilter = 'all';

  get filteredNotifications(): NotificationItem[] {
    return this.selectedFilter === 'unread'
      ? this.notifications.filter((n) => !n.isRead)
      : this.notifications;
  }

  onNotificationClick(notification: NotificationItem): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id);
    }

    this.notificationClick.emit(notification);
  }

  markAll(): void {
    this.notificationService.markAllAsRead();
  }
}
