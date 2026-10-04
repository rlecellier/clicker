import { DAYS_PER_WEEK, GAME_START, MS_PER_DAY } from './constants';

// Calendar date of the n-th day of the game (0 = the first Monday).
export const dateOfDay = (absoluteDay: number) =>
  new Date(GAME_START + absoluteDay * MS_PER_DAY);

// Days in the month of the Monday of the given week.
export const daysInMonthOfWeek = (week: number) => {
  const monday = dateOfDay(week * DAYS_PER_WEEK);
  return new Date(
    Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth() + 1, 0),
  ).getUTCDate();
};
