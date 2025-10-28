import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from './token.service';
import { inject } from '@angular/core';

export const cauthGuardGuard: CanActivateFn = (route, state) => {
   const tokenService = inject(TokenService);
    const router = inject(Router);
    // ✅ Check if user is logged in
    if (!tokenService.isLogged()) {
      router.navigate(['/createbranch']);
      return false;
    }

  return true;
};
