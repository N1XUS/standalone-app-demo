import { CompleteMessage, Message } from './message';

export interface NewRoom {
  name: string;
}

export class Room {
  messages: CompleteMessage[] = [];

  get lastMessage(): Message | undefined {
    return this.messages.reverse()[0];
  }

  constructor(public name: string, public id: string) {}
}
