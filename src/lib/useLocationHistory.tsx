import { useState } from 'react';
import { LocationEvent } from '../types/locationEvent';

export default function useLocationHistory() {
  const [history, setHistory] = useState<
    {
      sessionId: string;
      locations: LocationEvent[];
    }[]
  >([]);

  return {
    history,
    handleLocationEvent(event: LocationEvent) {
      setHistory(([...history]) => {
        let sess = history.find((l) => l.sessionId === event.sessionId);
        if (!sess) {
          sess = {
            sessionId: event.sessionId,
            locations: [event],
          };
          history.push(sess);
        } else {
          sess.locations.push(event);
          sess.locations.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
          sess.locations.splice(5); // keep only first 5 elems
        }
        return history;
      });
    },
  };
}
