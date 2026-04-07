import { Route } from '@angular/router';
import { MainShellComponent } from '@tradeforge/shell-feature-layout';
import { AppComponent } from './app';

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
        component: AppComponent, // temporary page
      },
    ],
  },
];
