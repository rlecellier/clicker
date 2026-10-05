import {
  DAYS_PER_WEEK,
  HOURS_PER_DAY,
  STEP_HOURS,
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
// is the date and time of the player (`startHours`, since that Monday 00:00).
export type GameStart = {
  origin: number;
  startHours: number;
};

// The start of a game launched at the given moment, in the local time of the
// player, rounded down to the half hour.
export const gameStartOf = (now: Date): GameStart => {
  const weekdayOfNow = (now.getDay() + 6) % DAYS_PER_WEEK;
  const hourOfDay =
    Math.floor((now.getHours() + now.getMinutes() / 60) / STEP_HOURS) *
    STEP_HOURS;
  return {
    origin: Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - weekdayOfNow,
    ),
    startHours: weekdayOfNow * HOURS_PER_DAY + hourOfDay,
  };
};

// Artificial calendar (ADR 0006): every week of the game is a month, named
// after the real month of the launch for week 0 and going on from there, and
// a year is 12 weeks. A month has 7 days, one per weekday.
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

// 1 to 7: the n-th day of the week-month.
export const dayOfMonth = (_origin: number, absoluteDay: number) =>
  weekdayIndex(absoluteDay) + 1;

export const yearOf = (origin: number, absoluteDay: number) =>
  Math.floor(monthsSinceYearZero(origin, absoluteDay) / WEEKS_PER_YEAR);
