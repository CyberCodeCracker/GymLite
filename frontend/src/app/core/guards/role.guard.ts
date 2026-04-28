import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const requiredRoles = (route.data['roles'] as string[] | undefined) ?? [];
  if (requiredRoles.length === 0 || authService.hasAnyRole(requiredRoles)) {
    return true;
  }

  return router.createUrlTree(['/products']);
};
