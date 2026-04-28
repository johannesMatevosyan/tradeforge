import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-market-watch',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './market-watch.component.html',
  styleUrls: ['./market-watch.component.scss'],
})
export class MarketWatchComponent {
  @Input() selectedSymbol = 'BTC/USD';
  @Input() symbols: { symbol: string; name: string }[] = [];
  @Output() symbolSelected = new EventEmitter<string>();
}
