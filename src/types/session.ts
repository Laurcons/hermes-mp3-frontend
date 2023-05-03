import { User } from './user';

export interface Session {
  id: string;
  wsId?: string;
  token: string;
  isAdmin: boolean;
  isTrackingLocation?: boolean;
  nickname?: string;
  user?: User;
}
