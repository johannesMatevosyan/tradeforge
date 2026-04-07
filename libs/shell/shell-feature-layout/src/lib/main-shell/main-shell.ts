import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { TopbarComponent } from '../topbar/topbar';
@Component({
  selector: 'app-main-shell',
  imports: [SidebarComponent, TopbarComponent, RouterOutlet],
  templateUrl: './main-shell.html',
  styleUrl: './main-shell.scss',
  standalone: true,
})
export class MainShellComponent {}
