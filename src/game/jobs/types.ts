import type { CalendarEvent } from '@game/calendar';

export type JobId = 'clothes-seller';

export type Job = {
  id: JobId;
  title: string;
  // what the job requires: the hours the player must work
  obligations: CalendarEvent[];
  // what the player plans to do about it, added to their plan on hire
  plan: CalendarEvent[];
};

// The job the player holds, and when they got it.
export type Employment = {
  id: JobId;
  // game hours since the start of the game
  since: number;
};
