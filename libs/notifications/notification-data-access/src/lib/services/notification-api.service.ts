import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { NotificationItem } from "../models/notification-item.model";

@Injectable({ providedIn: 'root' })
export class NotificationsApiService {
  private readonly http = inject(HttpClient);

  getNotifications(): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>('/api/notifications');
  }

  markAsRead(id: string): Observable<void> {
    return this.http.patch<void>(
      `/api/notifications/${id}/read`,
      {}
    );
  }

  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(
      '/api/notifications/read-all',
      {}
    );
  }

  clearAll(): Observable<void> {
    return this.http.delete<void>('/api/notifications');
  }
}
