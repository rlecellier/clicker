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
};
