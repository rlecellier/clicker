import { INITIAL_NUTRITION, type Nutrition } from '@game/nutrition';
import { DEFAULT_SPEED_INDEX } from '@game/time';

// Everything needed to resume a game: plain JSON, no function, no instant of
// the browser (ADR 0002).
export type GameState = Nutrition & {
  // game hours since Monday 00:00 of the first week
  elapsedHours: number;
  // index in SPEEDS
  speedIndex: number;
  // money in integer cents
  balanceCents: number;
};

export const INITIAL_GAME_STATE: GameState = {
  ...INITIAL_NUTRITION,
  elapsedHours: 0,
  speedIndex: DEFAULT_SPEED_INDEX,
  balanceCents: 0,
};
