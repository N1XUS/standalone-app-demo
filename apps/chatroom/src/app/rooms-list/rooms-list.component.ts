import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  NgZone,
  OnInit,
  WritableSignal,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ListComponent,
  ListContentDirective,
  ListItemComponent,
  ListLinkDirective,
} from '@fundamental-ngx/core/list';
import { HttpClient } from '@angular/common/http';
import { Room } from '@chatroom/shared';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { fromEvent, merge } from 'rxjs';
import {
  BarComponent,
  BarElementDirective,
  BarLeftDirective,
  BarRightDirective,
} from '@fundamental-ngx/core/bar';
import { ButtonComponent } from '@fundamental-ngx/core/button';
import { DialogService } from '@fundamental-ngx/core/dialog';
import { SocketService } from '../socket/socket.service';
import { HasEventTargetAddRemove } from 'rxjs/internal/observable/fromEvent';

@Component({
  selector: 'standalone-app-rooms-list',
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    ListComponent,
    ListItemComponent,
    ListLinkDirective,
    ListContentDirective,
    RouterLink,
    RouterLinkActive,
    BarComponent,
    BarRightDirective,
    ButtonComponent,
    BarLeftDirective,
    BarElementDirective,
  ],
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomsListComponent implements OnInit {
  rooms: WritableSignal<Room[]> = signal([]);
  _rooms: Room[] = [];
  private readonly _socket = inject(SocketService);

  private readonly _http = inject(HttpClient);

  private readonly _destroyRef = inject(DestroyRef);

  private readonly _dialogService = inject(DialogService);

  private readonly _injector = inject(Injector);

  private readonly _zone = inject(NgZone);

  ngOnInit(): void {
    this._zone.runOutsideAngular(() => {
      merge(
        this._http.get<Room[]>('/api/rooms'),
        fromEvent<Room>(
          this._socket.socket as unknown as HasEventTargetAddRemove<any>,
          'roomCreated'
        )
      )
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((newRoom) => {
          const newRooms = Array.isArray(newRoom) ? newRoom : [newRoom];
          this.rooms.update((rooms) => [...rooms, ...newRooms]);
          // Keep it to show how CDR works with standard arrays.
          this._rooms = [...this._rooms, ...newRooms];
        });
    });
  }

  openDialog(): void {
    import('../new-room/new-room.component').then((c) => {
      const dialogRef = this._dialogService.open(c.NewRoomComponent, {
        responsivePadding: true,
        focusTrapped: true,
        verticalPadding: true,
      });

      dialogRef.afterClosed.subscribe({
        next: (result) => {
          this._socket.socket?.emit('createRoom', result);
        },
        error: (error) => {
          console.log(error);
        },
      });
    });
  }

  openSettings(): void {
    runInInjectionContext(this._injector, () => {
      import('../settings/settings.component').then((c) => {
        const dialogRef = this._dialogService.open(c.SettingsComponent, {
          responsivePadding: true,
          focusTrapped: true,
          minWidth: '50vw',
          maxWidth: '900px',
          maxHeight: '80vh',
        });
      });
    });
  }
}
