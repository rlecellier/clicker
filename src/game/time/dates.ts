import {
  DATES_PER_DAY,
  DAYS_PER_WEEK,
  HOURS_PER_DAY,
  START_HOUR,
  WEEKS_PER_YEAR,
} from './constants';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Where a game begins: the Monday of the week it starts in (`origin`, the
// UTC midnight of that day) and the game hours of the moment it starts, which
// is 08:00 the next morning (`startHours`, since that Monday 00:00).
export type GameStart = {
  origin: number;
  startHours: number;
};

// The start of a game launched at the given moment: 08:00 the next morning, in
// the local time of the player.
export const gameStartOf = (now: Date): GameStart => {
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );
  const weekdayOfStart = (tomorrow.getDay() + 6) % DAYS_PER_WEEK;
  return {
    origin: Date.UTC(
      tomorrow.getFullYear(),
      tomorrow.getMonth(),
      tomorrow.getDate() - weekdayOfStart,
    ),
    startHours: weekdayOfStart * HOURS_PER_DAY + START_HOUR,
  };
};

// Artificial calendar (ADR 0006): every week of the game is a month, named
// after the real month of the launch for week 0 and going on from there, and
// a year is 12 weeks. A month has 28 dates, shared by its 7 days.
const monthsSinceYearZero = (origin: number, absoluteDay: number) => {
  const launch = new Date(origin);
  return (
    launch.getUTCFullYear() * WEEKS_PER_YEAR +
    launch.getUTCMonth() +
    Math.floor(absoluteDay / DAYS_PER_WEEK)
  );
};

// Index of the weekday of a day of the game, 0 = Monday.
export const weekdayIndex = (absoluteDay: number) =>
  absoluteDay % DAYS_PER_WEEK;

export const weekdayLabel = (_origin: number, absoluteDay: number) =>
  WEEKDAYS[weekdayIndex(absoluteDay)];

export const monthLabel = (origin: number, absoluteDay: number) =>
  MONTHS[monthsSinceYearZero(origin, absoluteDay) % WEEKS_PER_YEAR];

// 1 to 25: the first date of the month (of 28 dates) a day of the game covers,
// Monday being the 1st and Sunday the 25th.
export const dayOfMonth = (_origin: number, absoluteDay: number) =>
  weekdayIndex(absoluteDay) * DATES_PER_DAY + 1;

// 4 to 28: the last date of the month a day of the game covers.
export const lastDayOfMonth = (_origin: number, absoluteDay: number) =>
  (weekdayIndex(absoluteDay) + 1) * DATES_PER_DAY;

export const yearOf = (origin: number, absoluteDay: number) =>
  Math.floor(monthsSinceYearZero(origin, absoluteDay) / WEEKS_PER_YEAR);
