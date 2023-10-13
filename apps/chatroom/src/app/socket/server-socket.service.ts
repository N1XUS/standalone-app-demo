import { Injectable } from '@angular/core';

@Injectable()
export class ServerSocketService {
  socket: any = {
    on: () => {},
    off: () => {},
    removeListener: () => {},
  };
  connect(url: string): void {
    // Do nothing.
  }
}
