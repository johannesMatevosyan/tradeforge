import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { NotificationItem } from '../models/notification-item.model';
import { NotificationsApiService } from './notification-api.service';

export type CreateNotificationInput = {
  type: 'order' | 'system';
  title: string;
  message: string;
  actorName?: string;
  actorAvatarUrl?: string;
  route?: string;
  meta?: string;
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly notificationsApi = inject(NotificationsApiService);
  private readonly notificationsSubject =
    new BehaviorSubject<NotificationItem[]>([]);

  readonly notifications$ = this.notificationsSubject.asObservable();

  readonly unreadCount$ = this.notifications$.pipe(
    map((notifications) => notifications.filter((item) => !item.isRead).length)
  );

  loadNotifications(): void {
    this.notificationsApi.getNotifications().subscribe({
      next: (notifications) => {
        this.notificationsSubject.next(notifications);
      },
    });
  }

  markAsRead(id: string): void {
    this.notificationsApi.markAsRead(id).subscribe({
      next: () => {
        const updated = this.notificationsSubject.value.map((item) =>
          item.id === id ? { ...item, isRead: true } : item
        );

        this.notificationsSubject.next(updated);
      },
    });
  }

  markAllAsRead(): void {
    this.notificationsApi.markAllAsRead().subscribe({
      next: () => {
        const updated = this.notificationsSubject.value.map((item) => ({
          ...item,
          isRead: true,
        }));

        this.notificationsSubject.next(updated);
      },
    });
  }

  clear(): void {
    this.notificationsApi.clearAll().subscribe({
      next: () => {
        this.notificationsSubject.next([]);
      },
    });
  }
}
