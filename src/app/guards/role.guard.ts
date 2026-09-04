import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Check if user can access this route
  if (authService.canAccessRoute(state.url)) {
    return true;
  }

  // Redirect to dashboard if user doesn't have permission
  alert('You do not have permission to access this page.');
  router.navigate(['/dashboard']);
  return false;
};
