import { Component, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@fundamental-ngx/core/button';
import { DialogModule, DialogService } from '@fundamental-ngx/core/dialog';
import {
  FormControlComponent,
  FormItemComponent,
  FormLabelComponent,
} from '@fundamental-ngx/core/form';
import { SocketService } from '../socket/socket.service';

@Component({
  templateUrl: './no-chat-selected.component.html',
  styles: [
    `
      .no-chats-selected-message {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
    `,
  ],
  imports: [
    ButtonComponent,
    DialogModule,
    FormsModule,
    FormItemComponent,
    FormLabelComponent,
    FormControlComponent,
  ],
  standalone: true,
})
export class NoChatSelectedComponent {
  roomName = '';
  private readonly _dialogService = inject(DialogService);
  private readonly _socketConnection = inject(SocketService);
  openDialog(): void {
    import('../new-room/new-room.component').then((c) => {
      const dialogRef = this._dialogService.open(c.NewRoomComponent, {
        responsivePadding: true,
        focusTrapped: true,
        verticalPadding: true,
      });

      dialogRef.afterClosed.subscribe({
        next: (result) => {
          this._socketConnection.socket?.emit('createRoom', result);
        },
        error: (error) => {
          console.log(error);
        },
      });
    });
  }
}
