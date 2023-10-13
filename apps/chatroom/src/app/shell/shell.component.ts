import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  NgZone,
  OnInit,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  DynamicSideContentComponent,
  DynamicSideContentMainComponent,
  DynamicSideContentSideComponent,
} from '@fundamental-ngx/core/dynamic-side-content';
import { Socket } from 'socket.io-client';
import { UserStateService } from '../state/user-state.service';
import { RoomsListComponent } from '../rooms-list/rooms-list.component';
import { SocketService } from '../socket/socket.service';
import { SettingsGeneratorModule } from '@fundamental-ngx/platform/settings-generator';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const SOCKET_CONNECTION = new InjectionToken<Socket>('SocketConnection');

/**
 * Shell component is used as a main layout for logged-in users.
 */
@Component({
  selector: 'standalone-app-shell',
  standalone: true,
  imports: [
    RouterModule,
    DynamicSideContentComponent,
    DynamicSideContentSideComponent,
    DynamicSideContentMainComponent,
    RoomsListComponent,
    SettingsGeneratorModule,
  ],
  templateUrl: './shell.component.html',
  styleUrls: ['shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly _socket = inject(SocketService);
  private readonly _userState = inject(UserStateService);
  private readonly _zone = inject(NgZone);

  constructor() {
    this._zone.runOutsideAngular(() => {
      this._socket.connect('http://localhost:3000');

      fromEvent(this._socket.socket as any, 'connect')
        .pipe(takeUntilDestroyed())
        .subscribe(() => {
          this._initializeWsComunication();
        });

      fromEvent<string>(this._socket.socket as any, 'token')
        .pipe(takeUntilDestroyed())
        .subscribe((token: string) => {
          this._userState.id.set(token);
        });
    });
  }
  private _initializeWsComunication(): void {
    this._socket.socket?.emit('auth', this._userState.user());

    this._socket.socket?.on('roomCreated', (room: string) => {
      console.log(room);
    });
  }
}
