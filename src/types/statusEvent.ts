export interface StatusEvent {
  sessions: {
    activeParticipants: number;
    activeTrackings: number;
  };
}
