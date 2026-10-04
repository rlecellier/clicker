import { DEFAULT_PLAN, type Schedule } from '@game/calendar';
import { INITIAL_EXPENSES, type Expenses } from '@game/expenses';
import type { Employment } from '@game/jobs';
import { INITIAL_NUTRITION, type Nutrition } from '@game/nutrition';
import { INITIAL_READING, type Reading } from '@game/reading';
import { INITIAL_SLEEP, type Sleep } from '@game/sleep';
import { DEFAULT_SPEED_INDEX } from '@game/time';

// Everything needed to resume a game: plain JSON, no function, no instant of
// the browser (ADR 0002).
export type GameState = Nutrition &
  Sleep &
  Reading &
  Schedule & {
    // game hours since Monday 00:00 of the first week
    elapsedHours: number;
    // day the player was born, YYYY-MM-DD
    birthDate: string;
    // index in SPEEDS
    speedIndex: number;
    // money in integer cents
    balanceCents: number;
    // total paid so far, per kind of expense
    expenses: Expenses;
    // the job the player holds, if any
    job?: Employment;
    // the `ask` occurrence waiting for an answer: the game is paused until
    // the player gives one
    asking?: { eventId: string; day: number };
  };

export const INITIAL_GAME_STATE: GameState = {
  ...INITIAL_NUTRITION,
  ...INITIAL_SLEEP,
  ...INITIAL_READING,
  plan: DEFAULT_PLAN,
  declined: [],
  elapsedHours: 0,
  birthDate: '2009-02-01',
  speedIndex: DEFAULT_SPEED_INDEX,
  balanceCents: 0,
  expenses: INITIAL_EXPENSES,
};

// A brand new game for a player born on the given day.
export const newGameState = (birthDate: string): GameState => ({
  ...INITIAL_GAME_STATE,
  birthDate,
});
