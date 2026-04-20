import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '@tradeforge/auth-data-access';
import { SidebarComponent } from '../sidebar/sidebar';
import { TopbarComponent } from '../topbar/topbar';
@Component({
  selector: 'app-main-shell',
  imports: [SidebarComponent, TopbarComponent, RouterOutlet],
  templateUrl: './main-shell.html',
  styleUrl: './main-shell.scss',
  standalone: true,
})
export class MainShellComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  onLogout():void {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
  }
}
