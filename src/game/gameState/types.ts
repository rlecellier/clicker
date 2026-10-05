import type { ActionId } from '@game/actions';
import { INITIAL_COINS } from '@game/coins';
import { INITIAL_FRIDGE, type Fridge } from '@game/fridge';
import type { DoneEntry } from '@game/history';
import type { Employment, JobId } from '@game/jobs';
import type { Location } from '@game/location';
import { INITIAL_NUTRITION, type Nutrition } from '@game/nutrition';
import { INITIAL_READING, type Reading } from '@game/reading';
import { INITIAL_SLEEP, type Sleep } from '@game/sleep';
import type { GameStart } from '@game/time';

// What the player is in the middle of: the game time runs until it is over.
export type Activity = {
  // the action, or the job hunt
  id: ActionId | 'job-search';
  // game hours at which it started
  from: number;
  // game hours gone by since, up to the duration of the action
  done: number;
  // the job the hunt ends with
  jobId?: JobId;
  // a reading: hours that go to the book over the whole action, and the hours
  // already read of the book when it started
  reading?: { hours: number; bookFrom: number };
};

// An action chosen for a place the player is not at: it starts once they are
// there and free. `roll` in [0, 1) draws the book of a reading.
export type QueuedAction = { actionId: ActionId; roll: number };

// Everything needed to resume a game: plain JSON, no function, no instant of
// the browser (ADR 0002).
export type GameState = Nutrition &
  Fridge &
  Sleep &
  Reading & {
    // UTC midnight, in ms, of the Monday of the week the game started in:
    // day 0 of the game
    origin: number;
    // game hours since that Monday 00:00 at which the game started
    startHours: number;
    // game hours since that Monday 00:00; it only moves while an action runs
    elapsedHours: number;
    // day the player was born, YYYY-MM-DD
    birthDate: string;
    // gold coins, whole numbers
    coins: number;
    // where the player is: it decides the actions they can do
    location: Location;
    // the action in progress, if any
    activity?: Activity;
    // actions waiting for the player to be at their place, in the order they
    // were chosen
    queue: QueuedAction[];
    // what the player did, actions done in a row merged
    history: DoneEntry[];
    // the job the player holds, if any
    job?: Employment;
  };

// What a new game needs: when it starts, and who the player is.
export type NewGame = GameStart & {
  birthDate: string;
};

// A brand new game: the player is at home, jobless, with a few coins and a full
// fridge, and the calendar is empty.
export const newGameState = ({
  origin,
  startHours,
  birthDate,
}: NewGame): GameState => ({
  ...INITIAL_NUTRITION,
  ...INITIAL_FRIDGE,
  ...INITIAL_SLEEP,
  ...INITIAL_READING,
  origin,
  startHours,
  elapsedHours: startHours,
  birthDate,
  coins: INITIAL_COINS,
  location: 'home',
  queue: [],
  history: [],
});

// The game of the tests and of a provider without a saved game: it starts on
// Monday 1 February 2027 at 07:00.
export const INITIAL_GAME_STATE: GameState = newGameState({
  origin: Date.UTC(2027, 1, 1),
  startHours: 7,
  birthDate: '2009-02-01',
});
