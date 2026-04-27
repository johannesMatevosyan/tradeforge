import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject, } from '@angular/core';
import { PortfolioApi } from '@tradeforge/orders/order-data-access';

@Component({
  selector: 'lib-portfolio-summary',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe],
  templateUrl: './portfolio-summary.html',
  styleUrls: ['./portfolio-summary.scss'],
})
export class PortfolioSummary {
  private api = inject(PortfolioApi);

  readonly summary$ = this.api.summary$;
}
