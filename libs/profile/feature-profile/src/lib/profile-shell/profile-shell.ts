import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileSidebarComponent } from '../profile-sidebar/profile-sidebar';

@Component({
  selector: 'app-profile-shell',
  imports: [ProfileSidebarComponent, RouterOutlet],
  templateUrl: './profile-shell.html',
  styleUrls: ['./profile-shell.scss'],
  standalone: true,
})
export class ProfileShellComponent {}
