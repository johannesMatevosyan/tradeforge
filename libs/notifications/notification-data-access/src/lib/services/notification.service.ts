import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { NotificationItem } from '../models/notification-item.model';

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
    private readonly storageKey = 'tradeforge_notifications';
    private readonly notificationsSubject = new BehaviorSubject<NotificationItem[]>(
        this.loadFromStorage()
    );
    readonly notifications$ = this.notificationsSubject.asObservable();
    readonly unreadCount$ = this.notifications$.pipe(
        map((notifications) => notifications.filter((item) => !item.isRead).length)
    );

    private loadFromStorage(): NotificationItem[] {
    const raw = localStorage.getItem(this.storageKey);

    if (!raw) {
        return [];
    }

    try {
        return JSON.parse(raw) as NotificationItem[];
        } catch {
            return [];
        }
    }

    private updateNotifications(notifications: NotificationItem[]): void {
        this.notificationsSubject.next(notifications);
        localStorage.setItem(this.storageKey, JSON.stringify(notifications));
    }

    add(input: CreateNotificationInput): void {

        const newNotification: NotificationItem = {
            id: crypto.randomUUID(),
            type: input.type,
            title: input.title,
            message: input.message,

            actorName: input.actorName ?? 'System',
            actorAvatarUrl: input.actorAvatarUrl,

            createdAt: new Date().toISOString(),
            createdAtLabel: 'Just now',
            isRead: false,

            route: input.route,
            meta: input.meta,
        };

        const current = this.notificationsSubject.value;

        this.updateNotifications([
            newNotification,
            ...current,
        ].slice(0, 20));
    }

    markAsRead(id: string): void {
        const updated = this.notificationsSubject.value.map((item) =>
        item.id === id ? { ...item, isRead: true } : item
        );

        this.updateNotifications(updated);
    }

    markAllAsRead(): void {
        const updated = this.notificationsSubject.value.map((item) => ({
            ...item,
            isRead: true,
        }));

        this.updateNotifications(updated);
    }

    clear(): void {
        this.updateNotifications([]);
    }

}
