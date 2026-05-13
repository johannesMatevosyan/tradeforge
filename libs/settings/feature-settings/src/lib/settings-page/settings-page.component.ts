import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '@tradeforge/auth-data-access';
import { PageHeaderComponent } from '@tradeforge/shared-ui';
import { NotificationPreferences, SecuritySettings, TradingPreferences } from '../models/settings.model';

@Component({
  selector: 'lib-settings-page',
  imports: [CommonModule, PageHeaderComponent],
  standalone: true,
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent {
  private readonly authService = inject(AuthService);
  readonly user = this.authService.currentUser$;

  readonly userInitials = computed(() => {
    const user = this.user();

    const source = user?.name || user?.email || 'TradeForge User';

    return source
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  });

  readonly tradingPreferences = signal<TradingPreferences>({
    defaultOrderType: 'MARKET',
    chartInterval: '5m',
    currency: 'USD',
    darkMode: true,
  });

  readonly notificationPreferences = signal<NotificationPreferences>({
    emailNotifications: true,
    priceAlerts: true,
    orderExecutions: true,
    marketingNews: false,
  });

  readonly securitySettings = signal<SecuritySettings>({
    lastLogin: 'Today, 10:42',
    activeSessions: 1,
    twoFactorEnabled: false,
  });

  readonly developerInfo = {
    environment: 'DEV',
    websocketStatus: 'Connected',
    apiStatus: 'Healthy',
    appVersion: '0.1.0',
  };

  updateNotificationPreference(
    key: keyof NotificationPreferences,
    checked: boolean
  ): void {
    this.notificationPreferences.update((preferences) => ({
      ...preferences,
      [key]: checked,
    }));
  }
}
