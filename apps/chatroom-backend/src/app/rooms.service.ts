import { Room } from '@chatroom/shared';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class RoomsService {
  rooms = new Map<string, Room>();

  createRoom(name: string): Room {
    const id = randomUUID();
    const newRoom = new Room(name, id);

    this.rooms.set(id, newRoom);

    return newRoom;
  }
}
