// feature-analytics.routes.ts

import { Routes } from '@angular/router';
import { AnalyticsPageComponent } from './analytics-page/analytics-page.component';

export const featureAnalyticsRoutes: Routes = [
  {
    path: '',
    component: AnalyticsPageComponent,
  },
];
