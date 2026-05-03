import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NotificationService
} from '@tradeforge/notifications/notification-data-access';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'lib-notification-details.component',
  imports: [AsyncPipe],
  standalone: true,
  templateUrl: './notification-details.component.html',
  styleUrls: ['./notification-details.component.scss'],
})
export class NotificationDetailsComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notificationService = inject(NotificationService);

  readonly notification$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');

      return this.notificationService.notifications$.pipe(
        map((items) => items.find((item) => item.id === id))
      );
    })
  );

  goBack(): void {
    this.router.navigate(['/trading']);
  }
}
