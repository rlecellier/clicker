import type { ActionId } from '@game/actions';
import type { Action } from '@game/actions';
import type { Body } from '@game/body';
import type { GameState } from '@game/gameState';
import type { DoneEntry } from '@game/history';
import type { Employment, JobId, Shift, ShiftOccurrence } from '@game/jobs';
import type { Location } from '@game/location';
import type { CatalogBook } from '@game/reading';

export type GameContextValue = {
  // gold coins
  coins: number;
  // game hours since Monday 00:00 of the first week; it only moves while an
  // action runs
  elapsedHours: number;
  // UTC midnight, in ms, of the Monday of the first week: day 0 of the game
  origin: number;
  // day the player was born, YYYY-MM-DD
  birthDate: string;
  // game hours the player has lived since the game started
  playedHours: number;
  // age of the player in whole years
  age: number;
  week: number;
  weekHour: number;
  // where the player is
  location: Location;
  calories: number;
  // portions left in the fridge at home
  fridge: number;
  body: Body;
  // gauge between 0 and 100
  brain: number;
  // gauge below 100: a dream is made each time it is full
  dreamGauge: number;
  // dreams made so far
  dreams: number;
  // book on the go, none between two books
  currentBook: CatalogBook | undefined;
  // hours of reading spent on the current book so far
  bookHours: number;
  // books read to the last page, in reading order
  readBooks: CatalogBook[];
  // no book left to read
  isLibraryRead: boolean;
  // what the player did, actions done in a row merged
  history: DoneEntry[];
  // the job the player holds, if any
  job?: Employment;
  // the action in progress and how far it is, in game hours; none when the
  // player is free to act
  activity?: { title: string; done: number; hours: number };
  // the shift the player is in the middle of, if any
  currentShift?: Shift;
  // the next shift to start
  nextShift?: ShiftOccurrence;
  // the actions of the place the player is at, with what keeps them from
  // doing one
  actions: { action: Action; blocker?: string }[];
  perform: (actionId: ActionId) => void;
  goTo: (place: Location) => void;
  takeJob: (jobId: JobId) => void;
  restart: () => void;
};

export type GameProviderProps = {
  children: React.ReactNode;
  // game to resume, a new game when omitted
  initialState?: GameState;
  // keep the game in the browser, off by default so tests stay isolated
  persist?: boolean;
};
