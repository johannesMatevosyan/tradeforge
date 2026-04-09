import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-profile-account',
  imports: [CommonModule],
  templateUrl: './profile-account.html',
  styleUrls: ['./profile-account.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileAccountComponent {}
