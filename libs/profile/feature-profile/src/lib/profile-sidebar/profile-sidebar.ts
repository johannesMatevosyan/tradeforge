import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-profile-sidebar',
  imports: [],
  templateUrl: './profile-sidebar.html',
  styleUrl: './profile-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSidebarComponent {}
