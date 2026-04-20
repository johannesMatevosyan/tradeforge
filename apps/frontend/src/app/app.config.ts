import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthService, authInterceptor } from '@tradeforge/auth-data-access';
import { catchError, firstValueFrom, of } from 'rxjs';
import { appRoutes } from './app.routes';

function initAuth(authService: AuthService) {
  return () => {
    const token = authService.getToken();

    if (!token) {
      return Promise.resolve();
    }

    return firstValueFrom(
      authService.getMe().pipe(
        catchError(() => {
          authService.logout();
          return of(null);
        })
      )
    );
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(() => initAuth(inject(AuthService))()),
  ],
};
