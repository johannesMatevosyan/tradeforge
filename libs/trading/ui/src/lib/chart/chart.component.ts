import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-chart',
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  standalone: true,
})
export class ChartComponent {
  @Input() symbol: string = 'BTC/USD';
  @Input() price: number = 0;
  @Input() direction: 'up' | 'down' | 'neutral' = 'neutral';
}
