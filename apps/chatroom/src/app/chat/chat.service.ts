import { Injectable, NgZone, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, switchMap, tap } from 'rxjs';
import { CompleteMessage, Room } from '@chatroom/shared';
import { UserStateService } from '../state/user-state.service';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class ChatService {
  room = signal<Room | null>(null);
  messages = signal<CompleteMessage[]>([]);
  private readonly _socket = inject(SocketService);

  private readonly _route = inject(ActivatedRoute);

  private readonly _userService = inject(UserStateService);

  private readonly _zone = inject(NgZone);

  constructor() {
    this._zone.runOutsideAngular(() => {
      this._route.data
        .pipe(
          tap((data) => {
            const room: Room | null = data['room'] || null;
            this.room.set(room);

            if (!room) {
              return;
            }

            this.messages.set(
              room.messages
                .map((message) => {
                  message.created = new Date(
                    message.created as unknown as string
                  );
                  return message;
                })
                .sort((a, b) => (a.created > b.created ? 1 : -1))
            );
          }),
          switchMap(() => {
            return fromEvent<CompleteMessage & { roomId: string }>(
              this._socket.socket as any,
              'roomMessage'
            );
          }),
          takeUntilDestroyed()
        )
        .subscribe((message) => {
          if (message.roomId !== this.room()?.id) {
            return;
          }
          this.messages.update((messages) => {
            message.created = new Date(message.created as unknown as string);
            return [...messages, message].sort((a, b) =>
              a.created > b.created ? 1 : -1
            );
          });
        });
    });
  }

  sendMessage(text: string): void {
    const message: CompleteMessage & { roomId: string } = {
      roomId: this._route.snapshot.params['id'],
      message: text,
      author: this._userService.user(),
      created: new Date(),
    };

    this._socket.socket?.emit('newMessage', message);

    this.messages.update((messages) =>
      [...messages, message].sort((a, b) => (a.created > b.created ? 1 : -1))
    );
  }
}
