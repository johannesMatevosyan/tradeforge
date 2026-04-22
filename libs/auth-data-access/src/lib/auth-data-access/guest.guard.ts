import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { UserRole } from '@tradeforge/shared-types';
import { AuthService } from './auth.service';

export const guestGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        return true;
    }

    const currentUser = authService.getCurrentUser();

    if (currentUser?.role === UserRole.ADMIN) {
        return router.createUrlTree(['/admin']);
    }

    return router.createUrlTree(['/dashboard']);
};
