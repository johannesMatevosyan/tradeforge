export interface TradingPreferences {
  defaultOrderType: 'MARKET' | 'LIMIT';
  chartInterval: '1m' | '5m' | '15m' | '1h' | '1d';
  currency: 'USD' | 'EUR';
  darkMode: boolean;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  priceAlerts: boolean;
  orderExecutions: boolean;
  marketingNews: boolean;
}

export interface SecuritySettings {
  lastLogin: string;
  activeSessions: number;
  twoFactorEnabled: boolean;
}

export interface DeveloperInfo {
  environment: 'DEV' | 'STAGING' | 'PROD';
  websocketStatus: 'Connected' | 'Disconnected';
  apiStatus: 'Healthy' | 'Unavailable';
  appVersion: string;
}
