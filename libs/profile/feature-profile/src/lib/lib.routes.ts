import { Route } from '@angular/router';
import { ProfileShellComponent } from './profile-shell/profile-shell';

export const featureProfileRoutes: Route[] = [
  {
    path: '', component: ProfileShellComponent,
  },
];
