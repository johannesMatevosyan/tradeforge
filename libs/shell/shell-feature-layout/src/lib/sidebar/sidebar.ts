import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppIconComponent } from '../../../../../shared-ui-icons/src/lib/app-icon/app-icon';

@Component({
  selector: 'app-sidebar',
  imports: [AppIconComponent, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  standalone: true,
})
export class SidebarComponent {}
