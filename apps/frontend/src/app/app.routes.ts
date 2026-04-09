import { Route } from '@angular/router';
import { DashboardComponent } from '@tradeforge/feature-dashboard';
import { MainShellComponent } from '@tradeforge/shell-feature-layout';

export const appRoutes: Route[] = [
  {
    path: '',
    component: MainShellComponent, // 👈 shell wrapper
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent, // temporary page
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('@tradeforge/feature-profile').then((m) => m.featureProfileRoutes),
      },
    ],
  },
];
