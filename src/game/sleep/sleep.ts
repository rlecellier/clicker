import { EVENTS } from '@game/calendar';
import { HOURS_PER_DAY, HOURS_PER_WEEK } from '@game/time';

import {
  BRAIN_CAP,
  BRAIN_DRAIN_PER_HOUR,
  BRAIN_FILL_PER_HOUR,
  INITIAL_BRAIN,
} from './constants';
import type { Sleep } from './types';

export const INITIAL_SLEEP: Sleep = { brain: INITIAL_BRAIN };

const SLEEP_EVENTS = EVENTS.filter((event) => event.kind === 'sleep');

export const isSleeping = (weekHour: number) =>
  SLEEP_EVENTS.some((event) =>
    event.days.some((day) => {
      const start = day * HOURS_PER_DAY + event.start;
      return weekHour >= start && weekHour < day * HOURS_PER_DAY + event.end;
    }),
  );

// Runs the game hours between `from` and `to`: the brain fills while awake
// and empties during sleep. Events start and end on whole hours, so the time
// is cut at each of them and every piece is either awake or asleep.
export const stepSleep = (state: Sleep, from: number, to: number): Sleep => {
  let { brain } = state;
  for (let time = from; time < to;) {
    const end = Math.min(to, Math.floor(time) + 1);
    const hours = end - time;
    const weekHour = ((time + end) / 2) % HOURS_PER_WEEK;
    const change = isSleeping(weekHour)
      ? -BRAIN_DRAIN_PER_HOUR
      : BRAIN_FILL_PER_HOUR;
    brain = Math.min(Math.max(brain + change * hours, 0), BRAIN_CAP);
    time = end;
  }
  return { brain };
};
