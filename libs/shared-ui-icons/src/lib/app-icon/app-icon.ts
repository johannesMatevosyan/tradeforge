import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
    ArrowLeftRight,
    Bell,
    ChartColumn,
    LayoutDashboard,
    LogOut,
    LucideAngularModule,
    LucideIconData,
    Mail,
    Newspaper,
    Search,
    Settings,
    User,
    Wallet,
} from 'lucide-angular';

export type AppIconName =
  | 'dashboard'
  | 'chart'
  | 'transactions'
  | 'wallet'
  | 'news'
  | 'mail'
  | 'settings'
  | 'logout'
  | 'bell'
  | 'search'
  | 'user'
  | 'btc'
  | 'eth'
  | 'sol'
  | 'ltc';

@Component({
  selector: 'app-icon',
  imports: [
    CommonModule,
    LucideAngularModule,
  ],
  templateUrl: './app-icon.html',
  styleUrls: ['./app-icon.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppIconComponent {
  @Input({ required: true }) name!: AppIconName;
  @Input() size = 20;
  @Input() strokeWidth = 2;
  @Input() decorative = true;

  get lucideIcon(): LucideIconData | null {
    switch (this.name) {
      case 'dashboard':
        return LayoutDashboard;
      case 'chart':
        return ChartColumn;
      case 'transactions':
        return ArrowLeftRight;
      case 'wallet':
        return Wallet;
      case 'news':
        return Newspaper;
      case 'mail':
        return Mail;
      case 'settings':
        return Settings;
      case 'logout':
        return LogOut;
      case 'bell':
        return Bell;
      case 'search':
        return Search;
      case 'user':
        return User;
      default:
        return null;
    }
  }

  get coinSrc(): string | null {
    switch (this.name) {
      case 'btc':
        return 'assets/icons/coins/btc.svg';
      case 'eth':
        return 'assets/icons/coins/eth.svg';
      case 'sol':
        return 'assets/icons/coins/sol.svg';
      case 'ltc':
        return 'assets/icons/coins/ltc.svg';
      default:
        return null;
    }
  }
}
