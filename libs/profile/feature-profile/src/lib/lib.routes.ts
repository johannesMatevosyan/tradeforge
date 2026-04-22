import { Route } from '@angular/router';
import { ProfileShellComponent } from './profile-shell/profile-shell';

export const featureProfileRoutes: Route[] = [
  {
    path: '',
    component: ProfileShellComponent,
    children: [
      {
        path: '',
        redirectTo: 'account',
        pathMatch: 'full',
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./profile-account/profile-account').then(
            (m) => m.ProfileAccountComponent
          ),
      },
      {
        path: 'security',
        loadComponent: () =>
          import('./profile-security/profile-security.component').then(
            (m) => m.ProfileSecurityComponent,
          ),
      },
    ],
  },
];
