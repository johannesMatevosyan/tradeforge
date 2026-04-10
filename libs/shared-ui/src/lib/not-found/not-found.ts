import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrls: ['./not-found.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
