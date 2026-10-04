export { gameReducer } from './reducer';
export type { GameAction } from './reducer';
export {
  askingOf,
  canSlowDown,
  canSpeedUp,
  isEarning,
  isEnjoyingCakeNow,
  isReadingNow,
  isSleepingNow,
  locationOf,
  pendingPayOf,
  speedOf,
  weekHourOf,
  weekOf,
} from './selectors';
export { INITIAL_GAME_STATE, newGameState } from './types';
export type { GameState } from './types';
