import { Route } from '@angular/router';
import { authGuard, roleGuard } from '@tradeforge/auth-data-access';
import { DashboardComponent } from '@tradeforge/feature-dashboard';
import { UserRole } from '@tradeforge/shared-types';
import { NotFoundComponent } from '@tradeforge/shared-ui';
import { MainShellComponent } from '@tradeforge/shell-feature-layout';

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
          path: 'admin',
          canActivate: [roleGuard],
          data: { role: UserRole.ADMIN },
          loadComponent: () =>
            import('./pages/admin/admin.component').then((m) => m.AdminComponent),
        },
        {
          path: 'profile',
          loadChildren: () =>
            import('@tradeforge/feature-profile').then((m) => m.featureProfileRoutes),
        },
        {
          path: 'trading',
          loadComponent: () =>
            import('@tradeforge/trading/feature-trading').then(
              (m) => m.TradingPageComponent
            ),
        },
        {
          path: 'orders',
          loadComponent: () =>
            import('@tradeforge/orders/feature-orders').then(
              (m) => m.OrdersPageComponent
            ),
        },
        {
          path: 'portfolio',
          loadComponent: () =>
            import('@tradeforge/portfolio/feature-portfolio').then(
              (m) => m.PortfolioPageComponent
            ),
        },
        {
          path: 'notifications/:id',
          loadComponent: () =>
            import('@tradeforge/notifications/feature-notification-details')
              .then(m => m.NotificationDetailsComponent),
        },
        {
          path: '**',
          component: NotFoundComponent,
        },
      ],
    }
];
