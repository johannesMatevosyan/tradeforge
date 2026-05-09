import { Route } from '@angular/router';
import { MarketsPageComponent } from './markets-page/markets-page.component';

export const marketsRoutes: Route[] = [
  {
    path: '',
    component: MarketsPageComponent,
  },
];
