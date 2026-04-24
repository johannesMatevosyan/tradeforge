import { Component, inject, OnInit } from '@angular/core';
import { MarketDataWs } from '@tradeforge/market-data/market-data-access';

@Component({
  selector: 'lib-feature-ticker',
  imports: [],
  standalone: true,
  templateUrl: './feature-ticker.html',
  styleUrl: './feature-ticker.scss',
})
export class MarketDataFeatureTicker implements OnInit {
  private readonly ws = inject(MarketDataWs);

  ngOnInit(): void {
    this.ws.prices$().subscribe((data) => {
      console.log('WS prices:', data);
    });
  }
}
