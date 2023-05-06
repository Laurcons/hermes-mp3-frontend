import { Location } from './location';
import { Session } from './session';

export interface LocationEvent extends Location {
  _id: string;
  sessionId: string;
  timestamp: string;
  session: Pick<Session, 'id' | 'color' | 'role'>;
}
