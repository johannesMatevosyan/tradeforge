import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-chart',
  imports: [],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  standalone: true,
})
export class ChartComponent implements OnInit {
  @Input() symbol: string = 'BTC/USD';
  @Input() price: number = 43000;
  prevPrice = 42800;

  get isUp(): boolean {
    return this.price >= this.prevPrice;
  }

  ngOnInit(): void {
    setInterval(() => {
      this.prevPrice = this.price;
      this.price += (Math.random() - 0.5) * 100;
      this.price = Math.round(this.price);
    }, 1500);
  }
}
