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
    private readonly notificationsSubject = new BehaviorSubject<NotificationItem[]>([]);
    readonly notifications$ = this.notificationsSubject.asObservable();

    readonly unreadCount$ = this.notifications$.pipe(
        map((notifications) => notifications.filter((item) => !item.isRead).length)
    );

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

        this.notificationsSubject.next([
            newNotification,
            ...current,
        ].slice(0, 20));
    }

    markAsRead(id: string): void {
        const updated = this.notificationsSubject.value.map((item) =>
        item.id === id ? { ...item, isRead: true } : item
        );

        this.notificationsSubject.next(updated);
    }

    markAllAsRead(): void {
        const updated = this.notificationsSubject.value.map((item) => ({
            ...item,
            isRead: true,
        }));

        this.notificationsSubject.next(updated);
    }

    clear(): void {
        this.notificationsSubject.next([]);
    }

}
