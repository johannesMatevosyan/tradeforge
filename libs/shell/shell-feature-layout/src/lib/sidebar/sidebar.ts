import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIconComponent } from '../../../../../shared-ui-icons/src/lib/app-icon/app-icon';

@Component({
  selector: 'app-sidebar',
  imports: [AppIconComponent, RouterLink],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  standalone: true,
})
export class SidebarComponent {}
