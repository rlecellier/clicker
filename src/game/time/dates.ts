import {
  DAYS_PER_WEEK,
  HOURS_PER_DAY,
  MS_PER_DAY,
  STEP_HOURS,
} from './constants';

const weekday = new Intl.DateTimeFormat('en', {
  weekday: 'short',
  timeZone: 'UTC',
});

const month = new Intl.DateTimeFormat('en', {
  month: 'short',
  timeZone: 'UTC',
});

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

// Calendar date of the n-th day of a game (0 = the Monday of the first week).
export const dateOfDay = (origin: number, absoluteDay: number) =>
  new Date(origin + absoluteDay * MS_PER_DAY);

export const weekdayLabel = (origin: number, absoluteDay: number) =>
  weekday.format(dateOfDay(origin, absoluteDay));

export const monthLabel = (origin: number, absoluteDay: number) =>
  month.format(dateOfDay(origin, absoluteDay));

export const dayOfMonth = (origin: number, absoluteDay: number) =>
  dateOfDay(origin, absoluteDay).getUTCDate();

export const yearOf = (origin: number, absoluteDay: number) =>
  dateOfDay(origin, absoluteDay).getUTCFullYear();

// Index of the weekday of a day of the game, 0 = Monday.
export const weekdayIndex = (absoluteDay: number) =>
  absoluteDay % DAYS_PER_WEEK;
