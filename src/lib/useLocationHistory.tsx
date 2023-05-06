import { useState } from 'react';
import { LocationEvent } from '../types/locationEvent';
import { Location } from '@/types/location';

export default function useLocationHistory() {
  const [locations, setLocations] = useState<Record<string, LocationEvent>>({});

  return {
    locations: Object.keys(locations).map((key) => ({
      id: key,
      ...locations[key],
    })),
    handleLocationEvent(event: LocationEvent) {
      setLocations((locs) => ({
        ...locs,
        [event.sessionId]: event,
      }));
    },
  };
}
