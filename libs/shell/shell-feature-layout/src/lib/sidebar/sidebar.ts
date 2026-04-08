import { Component } from '@angular/core';
import { AppIconComponent } from '../../../../../shared-ui-icons/src/lib/app-icon/app-icon';

@Component({
  selector: 'app-sidebar',
  imports: [AppIconComponent],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  standalone: true,
})
export class SidebarComponent {}
