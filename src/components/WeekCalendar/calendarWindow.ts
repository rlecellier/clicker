import { DAYS_PER_WEEK, HOURS_PER_DAY, dateOfDay } from '@game/time';

// The calendar shows seven days starting on the current one. One column is
// kept on each side so that days can slide in and out of view.
export const COLUMNS_BEFORE = 1;
export const COLUMNS_AFTER = 2;

const weekday = new Intl.DateTimeFormat('en', {
  weekday: 'short',
  timeZone: 'UTC',
});
const month = new Intl.DateTimeFormat('en', {
  month: 'short',
  timeZone: 'UTC',
});

export const weekdayLabel = (absoluteDay: number) =>
  weekday.format(dateOfDay(absoluteDay));

export const dayOfMonth = (absoluteDay: number) =>
  dateOfDay(absoluteDay).getUTCDate();

// Index of the weekday of a day of the game, 0 = Monday.
export const weekdayIndex = (absoluteDay: number) =>
  absoluteDay % DAYS_PER_WEEK;

export const calendarWindow = (week: number, weekHour: number) => {
  const firstDay = week * DAYS_PER_WEEK + Math.floor(weekHour / HOURS_PER_DAY);

  const columns = Array.from(
    { length: COLUMNS_BEFORE + DAYS_PER_WEEK + COLUMNS_AFTER },
    (_, index) => firstDay - COLUMNS_BEFORE + index,
  ).filter((absoluteDay) => absoluteDay >= 0);

  const firstMonth = month.format(dateOfDay(firstDay));
  const lastMonth = month.format(dateOfDay(firstDay + DAYS_PER_WEEK - 1));
  const monthLabel =
    firstMonth === lastMonth ? firstMonth : `${firstMonth} – ${lastMonth}`;

  return { firstDay, columns, monthLabel };
};
