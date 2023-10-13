import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const USER_STORAGE_KEY = 'user';

export const authGuard: CanActivateFn = () => {
  if (inject(CookieService).get(USER_STORAGE_KEY)) {
    return true;
  }
  return inject(Router).parseUrl('/login');
};
