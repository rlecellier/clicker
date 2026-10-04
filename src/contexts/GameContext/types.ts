import type { GameState } from '@game/gameState';

export type GameContextValue = {
  // money in integer cents
  balanceCents: number;
  week: number;
  weekHour: number;
  speed: number;
  canSpeedUp: boolean;
  canSlowDown: boolean;
  pendingPayCents: number;
  isEarning: boolean;
  calories: number;
  fat: number;
  // gauge between 0 and 100
  brain: number;
  isSleeping: boolean;
  isEnjoyingCake: boolean;
  faster: () => void;
  slower: () => void;
  snack: () => void;
  cake: () => void;
};

export type GameProviderProps = {
  children: React.ReactNode;
  // game to resume, a new game when omitted
  initialState?: GameState;
  // keep the game in the browser, off by default so tests stay isolated
  persist?: boolean;
};
