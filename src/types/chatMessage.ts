import { Session } from './session';

export enum ChatRoom {
  participants = 'participants',
  volunteers = 'volunteers',
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  session?: Session;
  text: string;
  room: ChatRoom;
}
