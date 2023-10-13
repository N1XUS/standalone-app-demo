import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { Room } from '@chatroom/shared';
import { map } from 'rxjs';

export const chatGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  return inject(HttpClient)
    .get<{ room: Room | null }>(`api/room/${route.params['id']}`)
    .pipe(
      map((data) => {
        // Set data to route snapshot for later usage in component.
        route.data = data;
        return data.room ? true : router.parseUrl('/chats');
      })
    );
};
