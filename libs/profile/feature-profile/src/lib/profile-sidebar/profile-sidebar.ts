import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-profile-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './profile-sidebar.html',
  styleUrls: ['./profile-sidebar.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSidebarComponent {}
