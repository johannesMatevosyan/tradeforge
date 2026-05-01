import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TradingPositionView } from '@tradeforge/shared-types';

@Component({
  selector: 'lib-positions-table',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './positions-table.component.html',
  styleUrls: ['./positions-table.component.scss'],
})
export class PositionsTableComponent {
  @Input() positions: TradingPositionView[] = [];
}
