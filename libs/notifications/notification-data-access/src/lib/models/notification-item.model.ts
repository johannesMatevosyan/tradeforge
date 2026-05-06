export type NotificationType = 'order' | 'system';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  actorName: string;
  actorAvatarUrl?: string;
  title: string;
  message: string;
  createdAt: string;
  createdAtLabel: string;
  isRead: boolean;
  meta?: NotificationMeta;
  route?: string;
}

export interface NotificationMeta {
  orderId?: string;
  symbol?: string;
  side?: string;
}
