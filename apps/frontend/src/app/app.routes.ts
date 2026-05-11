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
          title: 'Dashboard',
          component: DashboardComponent, // temporary page
        },
        {
          path: 'admin',
          title: 'Admin',
          canActivate: [roleGuard],
          data: { role: UserRole.ADMIN },
          loadComponent: () =>
            import('./pages/admin/admin.component').then((m) => m.AdminComponent),
        },
        {
          path: 'profile',
          title: 'Profile',
          loadChildren: () =>
            import('@tradeforge/feature-profile').then((m) => m.featureProfileRoutes),
        },
        {
          path: 'trading',
          title: 'Trading',
          loadComponent: () =>
            import('@tradeforge/trading/feature-trading').then(
              (m) => m.TradingPageComponent
            ),
        },
        {
          path: 'orders',
          title: 'Orders',
          loadComponent: () =>
            import('@tradeforge/orders/feature-orders').then(
              (m) => m.OrdersPageComponent
            ),
        },
        {
          path: 'portfolio',
          title: 'Portfolio',
          loadComponent: () =>
            import('@tradeforge/portfolio/feature-portfolio').then(
              (m) => m.PortfolioPageComponent
            ),
        },
        {
          path: 'notifications/:id',
          title: 'Notification',
          loadComponent: () =>
            import('@tradeforge/notifications/feature-notification-details')
              .then(m => m.NotificationDetailsComponent),
        },
        {
          path: 'markets',
          title: 'Markets',
          loadChildren: () =>
            import('@tradeforge/markets/feature-markets').then(
              (m) => m.marketsRoutes
            ),
        },
        {
          path: 'watchlist',
          title: 'Watchlist',
          loadComponent: () =>
            import('@tradeforge/watchlist/feature-watchlist').then(
              (m) => m.WatchlistComponent
            ),
        },
        {
          path: 'analytics',
          title: 'Analytics',
          loadChildren: () =>
            import('@tradeforge/analytics/feature-analytics').then(
              (m) => m.featureAnalyticsRoutes
            ),
        },
        {
          path: '**',
          component: NotFoundComponent,
        },
      ],
    }
];
