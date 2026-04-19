import { Route } from '@angular/router';
import { DashboardComponent } from '@tradeforge/feature-dashboard';
import { NotFoundComponent } from '@tradeforge/shared-ui';
import { MainShellComponent } from '@tradeforge/shell-feature-layout';
import { authGuard } from './auth/auth.guard';

export const appRoutes: Route[] = [
    {
      path: 'auth',
      loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
    },
    {
      path: '',
      component: MainShellComponent, // Main shell wrapper
      canActivateChild: [authGuard],
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
        {
          path: '**',
          component: NotFoundComponent,
        },
      ],
    }
];
