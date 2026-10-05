import { DAYS_PER_WEEK, HOURS_PER_DAY } from '@game/time';

import type { Employment, Job, JobId, Shift } from './types';

const WEEKDAYS = [0, 1, 2, 3, 4];

export const JOBS: Record<JobId, Job> = {
  // mornings and afternoons on weekdays
  'clothes-seller': {
    id: 'clothes-seller',
    title: 'Clothes seller',
    hourlyCoins: 10,
    shifts: [
      {
        id: 'work-morning',
        title: 'Sell clothes',
        days: WEEKDAYS,
        start: 8,
        end: 12,
      },
      {
        id: 'work-afternoon',
        title: 'Sell clothes',
        days: WEEKDAYS,
        start: 13,
        end: 18,
      },
    ],
  },
};

export const JOB_IDS = Object.keys(JOBS) as JobId[];

export const isJobId = (value: unknown): value is JobId =>
  typeof value === 'string' && Object.hasOwn(JOBS, value);

export const hireAt = (id: JobId, hour: number): Employment => ({
  id,
  since: hour,
});

// The shifts the job requires on a day of the game, from the day it was taken.
export const shiftsOnDay = (
  employment: Employment | undefined,
  day: number,
): Shift[] =>
  employment && day >= Math.floor(employment.since / HOURS_PER_DAY)
    ? JOBS[employment.id].shifts.filter((shift) =>
        shift.days.includes(day % DAYS_PER_WEEK),
      )
    : [];

// The shift running at a given game hour, if any.
export const shiftAt = (employment: Employment | undefined, hour: number) => {
  const hourOfDay = hour % HOURS_PER_DAY;
  return shiftsOnDay(employment, Math.floor(hour / HOURS_PER_DAY)).find(
    (shift) => hourOfDay >= shift.start && hourOfDay < shift.end,
  );
};

export type ShiftOccurrence = {
  shift: Shift;
  // day of the game the shift is on
  day: number;
};

// The next shift to start after a given game hour: a weekly job has one within
// a week.
export const nextShiftAfter = (
  employment: Employment | undefined,
  hour: number,
): ShiftOccurrence | undefined => {
  const today = Math.floor(hour / HOURS_PER_DAY);
  for (let day = today; day <= today + DAYS_PER_WEEK; day += 1) {
    const shift = shiftsOnDay(employment, day)
      .filter((candidate) => day * HOURS_PER_DAY + candidate.start > hour)
      .toSorted((a, b) => a.start - b.start)[0];
    if (shift) return { shift, day };
  }
  return undefined;
};
