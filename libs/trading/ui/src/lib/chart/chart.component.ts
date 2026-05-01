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
  @Input() history: number[] = [];

  get points(): string {
    if (this.history.length < 2) {
      return '';
    }

    const width = 1000;
    const height = 320;
    const min = Math.min(...this.history);
    const max = Math.max(...this.history);
    const range = max - min || 1;

    return this.history
      .map((value, index) => {
        const x = (index / (this.history.length - 1)) * width;
        const y = height - ((value - min) / range) * height;

        return `${x},${y}`;
      })
      .join(' ');
  }
}
