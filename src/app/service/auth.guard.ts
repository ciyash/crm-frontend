import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from './token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // ✅ Check if user is logged in
  if (!tokenService.isLogged()) {
    router.navigate(['/login']);
    return false;
  }

  // ✅ Get the user role from the token
  const userRole = tokenService.getRole() || '';

  // ✅ Allow or deny access based on role and route
  if (route.data && route.data['roles']) {
    const allowedRoles = route.data['roles'] as string[];
    if (!userRole || !allowedRoles.includes(userRole)) {
      console.warn(`Access denied for role: ${userRole}`);
      router.navigate(['/login']);
      return false;
    }
  }

  return true;
};
