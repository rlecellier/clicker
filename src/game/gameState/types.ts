import { INITIAL_EXPENSES, type Expenses } from '@game/expenses';
import { INITIAL_NUTRITION, type Nutrition } from '@game/nutrition';
import { INITIAL_SLEEP, type Sleep } from '@game/sleep';
import { DEFAULT_SPEED_INDEX } from '@game/time';

// Everything needed to resume a game: plain JSON, no function, no instant of
// the browser (ADR 0002).
export type GameState = Nutrition &
  Sleep & {
    // game hours since Monday 00:00 of the first week
    elapsedHours: number;
    // index in SPEEDS
    speedIndex: number;
    // money in integer cents
    balanceCents: number;
    // total paid so far, per kind of expense
    expenses: Expenses;
  };

export const INITIAL_GAME_STATE: GameState = {
  ...INITIAL_NUTRITION,
  ...INITIAL_SLEEP,
  elapsedHours: 0,
  speedIndex: DEFAULT_SPEED_INDEX,
  balanceCents: 0,
  expenses: INITIAL_EXPENSES,
};
