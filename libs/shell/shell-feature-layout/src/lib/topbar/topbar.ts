import { Component, signal } from '@angular/core';
import { NotificationItem, NotificationPanelComponent } from '@tradeforge/shared-ui';


@Component({
  selector: 'app-topbar',
  imports: [NotificationPanelComponent],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
  standalone: true,
})
export class TopbarComponent {
    readonly isNotificationsOpen = signal(false);

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
}
