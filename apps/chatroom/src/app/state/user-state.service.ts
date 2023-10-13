import {
  Injectable,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { USER_STORAGE_KEY } from '../guards/auth.guard';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private readonly _cookie = inject(CookieService);

  private readonly _cookieUser = this._cookie.get(USER_STORAGE_KEY);

  private get _parsedUser(): { name: string; id: string } {
    return this._cookieUser
      ? JSON.parse(this._cookieUser)
      : {
          name: '',
          id: '',
        };
  }

  userName: WritableSignal<string> = signal(this._parsedUser.name);
  id: WritableSignal<string> = signal(this._parsedUser.id);

  user = computed(() => ({
    name: this.userName(),
    id: this.id(),
  }));

  constructor() {
    // Whenever we change something for user, store it in cookies.
    effect(() => {
      const user = { name: this.userName(), id: this.id() };
      this._setUser(user);
    });
  }

  private _setUser(user: { name: string; id?: string }): void {
    this._cookie.set(USER_STORAGE_KEY, JSON.stringify(user), 1, '/');
  }
}
