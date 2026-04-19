import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        loadComponent: () =>
        import('./pages/login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'register',
        loadComponent: () =>
        import('./pages/register/register.component').then((m) => m.RegisterComponent),
    },
    {
        path: 'forbidden',
        loadComponent: () =>
        import('./pages/forbidden/forbidden.component').then((m) => m.ForbiddenComponent),
    },
    {
        path: '**',
        redirectTo: 'login',
    }
];
