import { EVENTS } from '@game/calendar';
import { HOURS_PER_DAY, HOURS_PER_WEEK } from '@game/time';

import {
  BRAIN_ACTIVITY_FILL_PER_HOUR,
  BRAIN_CAP,
  BRAIN_DRAIN_PER_HOUR,
  BRAIN_IDLE_FILL_PER_HOUR,
  DREAM_CAP,
  INITIAL_BRAIN,
} from './constants';
import type { Sleep } from './types';

export const INITIAL_SLEEP: Sleep = {
  brain: INITIAL_BRAIN,
  dreamGauge: 0,
  dreams: 0,
};

const eventAt = (weekHour: number) =>
  EVENTS.find((event) =>
    event.days.some((day) => {
      const start = day * HOURS_PER_DAY + event.start;
      return weekHour >= start && weekHour < day * HOURS_PER_DAY + event.end;
    }),
  );

export const isSleeping = (weekHour: number) =>
  eventAt(weekHour)?.kind === 'sleep';

// Runs the game hours between `from` and `to`. Awake, the brain fills slowly
// and faster during an activity. Asleep it empties, and what it has no more
// to empty goes to the dream gauge. Events start and end on half hours, so
// the time is cut at each of them and every piece is a single event.
export const stepSleep = (state: Sleep, from: number, to: number): Sleep => {
  let { brain, dreamGauge } = state;
  for (let time = from; time < to;) {
    const end = Math.min(to, (Math.floor(time * 2) + 1) / 2);
    const hours = end - time;
    const event = eventAt(((time + end) / 2) % HOURS_PER_WEEK);
    if (event?.kind === 'sleep') {
      const drain = BRAIN_DRAIN_PER_HOUR * hours;
      const drained = Math.min(brain, drain);
      brain -= drained;
      dreamGauge += drain - drained;
    } else {
      const fill =
        BRAIN_IDLE_FILL_PER_HOUR +
        (event ? BRAIN_ACTIVITY_FILL_PER_HOUR[event.kind] : 0);
      brain = Math.min(brain + fill * hours, BRAIN_CAP);
    }
    time = end;
  }
  const newDreams = Math.floor(dreamGauge / DREAM_CAP);
  return {
    brain,
    dreamGauge: dreamGauge - newDreams * DREAM_CAP,
    dreams: state.dreams + newDreams,
  };
};
