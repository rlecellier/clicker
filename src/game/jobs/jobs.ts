import type { CalendarEvent, Recurrence } from '@game/calendar';

import type { Employment, Job, JobId } from './types';

const WEEKDAYS: Recurrence = { type: 'weekly', days: [0, 1, 2, 3, 4] };

// The hours of a clothes seller: mornings and afternoons on weekdays.
const WORK_HOURS = [
  { id: 'work-morning', start: 8, end: 12 },
  { id: 'work-afternoon', start: 13, end: 18 },
];

const obligationsOf = (title: string): CalendarEvent[] =>
  WORK_HOURS.map((hours) => ({
    ...hours,
    title,
    kind: 'work',
    mode: 'auto',
    recurrence: WEEKDAYS,
  }));

export const JOBS: Record<JobId, Job> = {
  'clothes-seller': {
    id: 'clothes-seller',
    title: 'Clothes seller',
    obligations: obligationsOf('Sell clothes'),
    plan: obligationsOf('Go to work'),
  },
};

export const JOB_IDS = Object.keys(JOBS) as JobId[];

export const isJobId = (value: unknown): value is JobId =>
  typeof value === 'string' && Object.hasOwn(JOBS, value);

export const hireAt = (id: JobId, hour: number): Employment => ({
  id,
  since: hour,
});
