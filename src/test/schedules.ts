import {
  DEFAULT_PLAN,
  type CalendarEvent,
  type Schedule,
} from '@game/calendar';
import { JOBS, type Employment } from '@game/jobs';

// A clothes seller since the very start of the game.
export const EMPLOYMENT: Employment = { id: 'clothes-seller', since: 0 };

// A reading event every evening, from 20:00 to 23:00.
export const EVENING_READING: CalendarEvent = {
  id: 'read-evening',
  title: 'Read a book',
  kind: 'read',
  mode: 'auto',
  recurrence: { type: 'weekly', days: [0, 1, 2, 3, 4, 5, 6] },
  start: 20,
  end: 23,
};

// Sleep, meals and the workdays of the clothes seller.
export const WORKING_SCHEDULE: Schedule = {
  plan: [...DEFAULT_PLAN, ...JOBS['clothes-seller'].plan],
  declined: [],
};

// The working schedule, and the evening reading on top.
export const READING_SCHEDULE: Schedule = {
  plan: [...WORKING_SCHEDULE.plan, EVENING_READING],
  declined: [],
};

// A job and the working schedule, to spread over a game state.
export const WORKING_STATE = { ...WORKING_SCHEDULE, job: EMPLOYMENT };
