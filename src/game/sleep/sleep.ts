import { eventAt, type Schedule } from '@game/calendar';
import { BRAIN_READING_FILL_PER_HOUR } from '@game/reading';

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

export const isSleeping = (schedule: Schedule, hour: number) =>
  eventAt(schedule, hour)?.kind === 'sleep';

// Runs the game hours between `from` and `to`. Awake, the brain fills slowly
// and faster during an activity. Asleep it empties, and what it has no more
// to empty goes to the dream gauge. Events start and end on half hours, so
// the time is cut at each of them and every piece is a single event. The
// `readingHours` of the interval are the hours of reading events that move the
// book, from its start: they fill the brain faster.
export const stepSleep = (
  state: Sleep & Schedule,
  from: number,
  to: number,
  readingHours = 0,
): Sleep => {
  let reading = readingHours;
  let { brain, dreamGauge } = state;
  for (let time = from; time < to;) {
    const end = Math.min(to, (Math.floor(time * 2) + 1) / 2);
    const hours = end - time;
    const event = eventAt(state, (time + end) / 2);
    if (event?.kind === 'sleep') {
      const drain = BRAIN_DRAIN_PER_HOUR * hours;
      const drained = Math.min(brain, drain);
      brain -= drained;
      dreamGauge += drain - drained;
    } else {
      let fill =
        (BRAIN_IDLE_FILL_PER_HOUR +
          (event ? BRAIN_ACTIVITY_FILL_PER_HOUR[event.kind] : 0)) *
        hours;
      if (event?.kind === 'read') {
        const read = Math.min(hours, reading);
        reading -= read;
        fill += BRAIN_READING_FILL_PER_HOUR * read;
      }
      brain = Math.min(brain + fill, BRAIN_CAP);
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
