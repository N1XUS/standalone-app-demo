import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './gateways/chat.gateway';
import { RoomsService } from './rooms.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, RoomsService, ChatGateway],
})
export class AppModule {}
