import { Controller, Get, Param } from '@nestjs/common';

import { AppService } from './app.service';
import { RoomsService } from './rooms.service';
import { Room } from '@chatroom/shared';

@Controller()
export class AppController {
  constructor(private readonly _roomService: RoomsService) {}

  @Get('rooms')
  getRooms(): Room[] {
    return Array.from(this._roomService.rooms.values());
  }

  @Get('room/:id')
  getRoom(@Param('id') id: string): { room: Room | null } {
    return { room: this._roomService.rooms.get(id) || null };
  }
}
