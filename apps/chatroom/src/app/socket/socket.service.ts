import { Injectable } from '@angular/core';
import { Nullable } from '@fundamental-ngx/cdk/utils';
import { Socket, io } from 'socket.io-client';

@Injectable()
export class SocketService {
  socket: Nullable<Socket>;
  connect(url: string): void {
    this.socket = io(url);
  }
}
