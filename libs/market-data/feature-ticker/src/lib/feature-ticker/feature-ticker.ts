import { AsyncPipe, CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MarketDataWs, MarketPriceWithDirection } from '@tradeforge/market-data/market-data-access';
import { Observable, scan } from 'rxjs';

@Component({
  selector: 'lib-feature-ticker',
  imports: [AsyncPipe, CommonModule, DecimalPipe, DatePipe],
  standalone: true,
  templateUrl: './feature-ticker.html',
  styleUrl: './feature-ticker.scss',
})
export class MarketDataFeatureTicker {
  private readonly ws = inject(MarketDataWs);
  readonly prices$: Observable<MarketPriceWithDirection[]> = this.ws.prices$().pipe(

    scan((prev: MarketPriceWithDirection[], curr) => {
      return curr.map((item) => {
        const previous = prev.find((p) => p.symbol === item.symbol);

        let direction: 'up' | 'down' | 'flat' = 'flat';

        if (previous) {
          if (item.price > previous.price) direction = 'up';
          else if (item.price < previous.price) direction = 'down';
        }

        return {
          ...item,
          direction,
        };
      });
    }, [])
  );

}
