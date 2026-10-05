import type { EventKind } from '@game/history';
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

type SleepStep = {
  kind: EventKind;
  hours: number;
};

// Runs an action. Awake, the brain fills slowly and faster during an
// activity. Asleep it empties, and what it has no more to empty goes to the
// dream gauge. The `readingHours` of the action are the hours spent on the
// book, which fill the brain faster.
export const stepSleep = (
  state: Sleep,
  { kind, hours }: SleepStep,
  readingHours = 0,
): Sleep => {
  let { brain, dreamGauge } = state;

  if (kind === 'sleep') {
    const drain = BRAIN_DRAIN_PER_HOUR * hours;
    const drained = Math.min(brain, drain);
    brain -= drained;
    dreamGauge += drain - drained;
  } else {
    const fill =
      (BRAIN_IDLE_FILL_PER_HOUR + BRAIN_ACTIVITY_FILL_PER_HOUR[kind]) * hours +
      BRAIN_READING_FILL_PER_HOUR * readingHours;
    brain = Math.min(brain + fill, BRAIN_CAP);
  }

  const newDreams = Math.floor(dreamGauge / DREAM_CAP);
  return {
    brain,
    dreamGauge: dreamGauge - newDreams * DREAM_CAP,
    dreams: state.dreams + newDreams,
  };
};
