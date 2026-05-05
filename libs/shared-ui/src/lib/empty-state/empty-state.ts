import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-empty-state',
  imports: [],
  standalone: true,
  templateUrl: './empty-state.html',
  styleUrls: ['./empty-state.scss'],
})
export class EmptyStateComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() icon = '📭';
}
