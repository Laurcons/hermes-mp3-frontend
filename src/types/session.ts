import { User } from './user';

export enum SessionRole {
  participant = 'participant',
  volunteer = 'volunteer',
  admin = 'admin',
}

export interface Session {
  id: string;
  wsId?: string;
  token: string;
  isAdmin: boolean;
  isTrackingLocation?: boolean;
  nickname?: string;
  color: string;
  role: SessionRole;
  user?: User;
}
