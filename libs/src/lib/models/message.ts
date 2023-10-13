export interface Message {
  message: string;
  author: {
    name: string;
    id: string;
  };
  created?: Date;
}

export type CompleteMessage = Required<Message>;
