import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService, UserListItem } from '@tradeforge/auth-data-access';
import { catchError, Observable, of, shareReplay } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AsyncPipe, DatePipe, CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
    private readonly authService = inject(AuthService);

    readonly users$: Observable<UserListItem[]> = this.authService.getUsers().pipe(
      shareReplay(1),
      catchError((error) => {
        console.error('Failed to load users', error);
        return of([] as UserListItem[]);
      }),
    );
}
