import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PositionsApi } from '@tradeforge/orders/order-data-access';

@Component({
  selector: 'lib-positions',
  imports: [AsyncPipe, DecimalPipe],
  standalone: true,
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss'],
})
export class PositionsComponent {
  private api = inject(PositionsApi);

  readonly positions$ = this.api.getPositions();
}
