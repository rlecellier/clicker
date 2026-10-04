import { occursOn } from '@game/calendar';
import { JOBS, type Employment, type JobId } from '@game/jobs';
import {
  DAYS_PER_WEEK,
  HOURS_PER_DAY,
  HOURS_PER_WEEK,
  daysInMonthOfWeek,
} from '@game/time';

import { MONTHLY_SALARY_CENTS } from './constants';

// Hours of work a job requires in a full week.
const weeklyHoursOf = (id: JobId) =>
  JOBS[id].obligations.reduce(
    (total, event) =>
      total +
      Array.from({ length: DAYS_PER_WEEK }).filter((_, day) =>
        occursOn(event, day),
      ).length *
        (event.end - event.start),
    0,
  );

// A week is worth 7/N of the monthly salary in a month of N days.
export const weeklyPayCents = (week: number) =>
  Math.round((MONTHLY_SALARY_CENTS * DAYS_PER_WEEK) / daysInMonthOfWeek(week));

// Hours the job required between two game hours, from the day it started.
export const obligationHoursBetween = (
  job: Employment | undefined,
  from: number,
  to: number,
) => {
  if (!job) return 0;
  const start = Math.max(from, job.since);
  const { obligations } = JOBS[job.id];
  let hours = 0;
  for (
    let day = Math.floor(start / HOURS_PER_DAY);
    day <= Math.floor(to / HOURS_PER_DAY);
    day += 1
  ) {
    for (const event of obligations) {
      if (!occursOn(event, day)) continue;
      const overlapStart = Math.max(start, day * HOURS_PER_DAY + event.start);
      const overlapEnd = Math.min(to, day * HOURS_PER_DAY + event.end);
      hours += Math.max(overlapEnd - overlapStart, 0);
    }
  }
  return hours;
};

// Pay of a week, for the hours the job required in it (the whole week once the
// job has been held since before it started).
const weekPayCents = (
  job: Employment | undefined,
  week: number,
  until: number,
) =>
  job
    ? Math.round(
        (weeklyPayCents(week) *
          obligationHoursBetween(job, week * HOURS_PER_WEEK, until)) /
          weeklyHoursOf(job.id),
      )
    : 0;

// Pay of the weeks that ended between two game hours.
export const payBetween = (
  job: Employment | undefined,
  from: number,
  to: number,
) => {
  let pay = 0;
  const lastWeek = Math.floor(to / HOURS_PER_WEEK);
  for (
    let week = Math.floor(from / HOURS_PER_WEEK);
    week < lastWeek;
    week += 1
  ) {
    pay += weekPayCents(job, week, (week + 1) * HOURS_PER_WEEK);
  }
  return pay;
};

// Pay earned so far this week, paid out once the week is over.
export const pendingPayCents = (job: Employment | undefined, hour: number) =>
  weekPayCents(job, Math.floor(hour / HOURS_PER_WEEK), hour);

// Whether the job requires work at a given game hour.
export const isWorkHours = (job: Employment | undefined, hour: number) => {
  if (!job || hour < job.since) return false;
  const day = Math.floor(hour / HOURS_PER_DAY);
  const hourOfDay = hour % HOURS_PER_DAY;
  return JOBS[job.id].obligations.some(
    (event) =>
      occursOn(event, day) && hourOfDay >= event.start && hourOfDay < event.end,
  );
};
