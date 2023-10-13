import { CompleteMessage, Message, NewRoom } from '@chatroom/shared';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { RoomsService } from '../rooms.service';
import { randomUUID } from 'crypto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private readonly _roomsService: RoomsService) {}
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('message')
  handleMessage(client: Socket<any>, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('auth')
  handleAuthmessage(
    client: Socket<any>,
    payload: { name: string; id?: string }
  ): string {
    const id = payload.id || randomUUID();
    client.join('allRooms');
    client.join(id);
    client.data = {};
    client.data.id = id;
    client.data.name = payload.name;
    client.emit('token', client.data.id);
    return 'Authorized';
  }

  @SubscribeMessage('createRoom')
  handleCreateRoomMessage(client: Socket<any>, payload: string): void {
    const room = this._roomsService.createRoom(payload);
    this.server.to('allRooms').emit('roomCreated', room);
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(
    client: Socket<any>,
    payload: Message & { roomId: string }
  ): void {
    const room = this._roomsService.rooms.get(payload.roomId);

    if (!room) {
      return;
    }

    payload.created = new Date();

    room.messages.push(payload as CompleteMessage);

    room.messages = room.messages.sort((a, b) =>
      a.created > b.created ? 1 : -1
    );

    this.server
      .to('allRooms')
      .except(client.data.id)
      .emit('roomMessage', room.lastMessage);
  }
}
