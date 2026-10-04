import type { Body } from '@game/body';
import type { Expenses } from '@game/expenses';
import type { GameState } from '@game/gameState';
import type { Location } from '@game/location';

export type GameContextValue = {
  // money in integer cents
  balanceCents: number;
  // total paid so far, per kind of expense
  expenses: Expenses;
  // game hours since Monday 00:00 of the first week
  elapsedHours: number;
  // day the player was born, YYYY-MM-DD
  birthDate: string;
  // age of the player in whole years
  age: number;
  week: number;
  weekHour: number;
  speed: number;
  canSpeedUp: boolean;
  canSlowDown: boolean;
  pendingPayCents: number;
  isEarning: boolean;
  location: Location;
  calories: number;
  body: Body;
  // gauge between 0 and 100
  brain: number;
  // gauge below 100: a dream is made each time it is full
  dreamGauge: number;
  // dreams made so far
  dreams: number;
  isSleeping: boolean;
  isEnjoyingCake: boolean;
  // free-time hours spent on the book so far
  bookHours: number;
  isBookFinished: boolean;
  // the player reads and nothing is scheduled: the book moves on
  isReadingNow: boolean;
  // the player wants to read, in free time or not
  isReading: boolean;
  faster: () => void;
  slower: () => void;
  snack: () => void;
  cake: () => void;
  toggleReading: () => void;
  restart: () => void;
};

export type GameProviderProps = {
  children: React.ReactNode;
  // game to resume, a new game when omitted
  initialState?: GameState;
  // keep the game in the browser, off by default so tests stay isolated
  persist?: boolean;
};
