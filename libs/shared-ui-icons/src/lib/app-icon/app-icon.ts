import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  Activity,
  ArrowLeftRight,
  Bell,
  BriefcaseBusiness,
  ChartCandlestick,
  ChartNoAxesCombined,
  FolderKanban,
  LayoutDashboard,
  ListVideo,
  LogOut,
  LucideAngularModule,
  LucideIconData,
  Search,
  Settings,
  User,
  X
} from 'lucide-angular';

export type AppIconName =
  | 'dashboard'
  | 'chart-candlestick'
  | 'activity'
  | 'briefcase-business'
  | 'arrow-left-right'
  | 'list-video'
  | 'chart-no-axes-combined'
  | 'logout'
  | 'bell'
  | 'search'
  | 'settings'
  | 'user'
  | 'btc'
  | 'eth'
  | 'sol'
  | 'ltc'
  | 'x'
  | 'folder-kanban';

@Component({
  selector: 'lib-app-icon',
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
  @Input() color = 'currentColor';

  get lucideIcon(): LucideIconData | null {
    switch (this.name) {
      case 'dashboard':
        return LayoutDashboard;
      case 'chart-candlestick':
        return ChartCandlestick;
      case 'briefcase-business':
        return BriefcaseBusiness;
      case 'arrow-left-right':
        return ArrowLeftRight;
      case 'list-video':
        return ListVideo;
      case 'chart-no-axes-combined':
        return ChartNoAxesCombined;
      case 'settings':
        return Settings;
      case 'activity':
        return Activity;
      case 'logout':
        return LogOut;
      case 'bell':
        return Bell;
      case 'search':
        return Search;
      case 'user':
        return User;
      case 'x':
        return X;
      case 'folder-kanban':
        return FolderKanban;
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
