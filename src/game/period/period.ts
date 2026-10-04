import {
  GAME_START,
  HOURS_PER_DAY,
  HOURS_PER_WEEK,
  MS_PER_DAY,
  dateOfDay,
} from '@game/time';

import { PERIODS } from './constants';

export type Period = (typeof PERIODS)[number];

// Game hour of a calendar date, never before the start of the game.
const hourOfDate = (date: number) =>
  Math.max(0, ((date - GAME_START) / MS_PER_DAY) * HOURS_PER_DAY);

// The span from the start of the current week, month or year to now. Only the
// ongoing period exists: the past ones are not kept.
export const periodRange = (period: Period, elapsedHours: number) => {
  const today = dateOfDay(Math.floor(elapsedHours / HOURS_PER_DAY));
  const year = today.getUTCFullYear();
  const month = today.getUTCMonth();
  const from = {
    week: Math.floor(elapsedHours / HOURS_PER_WEEK) * HOURS_PER_WEEK,
    month: hourOfDate(Date.UTC(year, month, 1)),
    year: hourOfDate(Date.UTC(year, 0, 1)),
  }[period];
  return { from, to: elapsedHours };
};
