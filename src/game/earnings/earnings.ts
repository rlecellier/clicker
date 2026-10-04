import { EVENTS } from '@game/calendar';
import {
  DAYS_PER_WEEK,
  HOURS_PER_DAY,
  HOURS_PER_WEEK,
  daysInMonthOfWeek,
} from '@game/time';

import { MONTHLY_SALARY_CENTS } from './constants';

const WORK_EVENTS = EVENTS.filter((event) => event.kind === 'work');

const WORK_HOURS_PER_WEEK = WORK_EVENTS.reduce(
  (total, event) => total + event.days.length * (event.end - event.start),
  0,
);

// A week is worth 7/N of the monthly salary in a month of N days.
export const weeklyPayCents = (week: number) =>
  Math.round((MONTHLY_SALARY_CENTS * DAYS_PER_WEEK) / daysInMonthOfWeek(week));

// Pay of the weeks that ended between two game hours.
export const payBetween = (from: number, to: number) => {
  let pay = 0;
  const lastWeek = Math.floor(to / HOURS_PER_WEEK);
  for (
    let week = Math.floor(from / HOURS_PER_WEEK);
    week < lastWeek;
    week += 1
  ) {
    pay += weeklyPayCents(week);
  }
  return pay;
};

// Pay earned so far this week, paid out once the week is over.
export const pendingPayCents = (week: number, weekHour: number) => {
  let workedHours = 0;
  for (const event of WORK_EVENTS) {
    for (const day of event.days) {
      const elapsed = weekHour - (day * HOURS_PER_DAY + event.start);
      workedHours += Math.min(Math.max(elapsed, 0), event.end - event.start);
    }
  }
  return Math.round((weeklyPayCents(week) * workedHours) / WORK_HOURS_PER_WEEK);
};

export const isWorkHours = (weekHour: number) =>
  WORK_EVENTS.some((event) =>
    event.days.some((day) => {
      const start = day * HOURS_PER_DAY + event.start;
      const end = day * HOURS_PER_DAY + event.end;
      return weekHour >= start && weekHour < end;
    }),
  );
