import { DAYS_PER_WEEK, EVENTS, HOURS_PER_DAY } from '@hook/useWeekClock';

import { GAME_START, MONTHLY_SALARY } from './constants';

const MS_PER_DAY = HOURS_PER_DAY * 3600 * 1000;

const WORK_EVENTS = EVENTS.filter((event) => event.kind === 'work');

const WORK_HOURS_PER_WEEK = WORK_EVENTS.reduce(
  (total, event) => total + event.days.length * (event.end - event.start),
  0,
);

const roundCents = (amount: number) => Math.round(amount * 100) / 100;

// Days in the month of the week's Monday.
const daysInMonth = (week: number) => {
  const monday = new Date(GAME_START + week * DAYS_PER_WEEK * MS_PER_DAY);
  return new Date(
    Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth() + 1, 0),
  ).getUTCDate();
};

// A week is worth 7/N of the monthly salary in a month of N days.
export const weeklyPay = (week: number) =>
  roundCents((MONTHLY_SALARY * DAYS_PER_WEEK) / daysInMonth(week));

// Pay of every week finished before the given one.
export const bankedPay = (week: number) => {
  let total = 0;
  for (let past = 0; past < week; past += 1) total += weeklyPay(past);
  return total;
};

// Pay earned so far this week, paid out once the week is over.
export const pendingPay = (week: number, weekHour: number) => {
  let workedHours = 0;
  for (const event of WORK_EVENTS) {
    for (const day of event.days) {
      const elapsed = weekHour - (day * HOURS_PER_DAY + event.start);
      workedHours += Math.min(Math.max(elapsed, 0), event.end - event.start);
    }
  }
  return roundCents((weeklyPay(week) * workedHours) / WORK_HOURS_PER_WEEK);
};

export const isWorking = (weekHour: number) =>
  WORK_EVENTS.some((event) =>
    event.days.some((day) => {
      const start = day * HOURS_PER_DAY + event.start;
      const end = day * HOURS_PER_DAY + event.end;
      return weekHour >= start && weekHour < end;
    }),
  );
