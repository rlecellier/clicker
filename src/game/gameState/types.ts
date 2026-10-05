import type { DoneEntry } from '@game/history';
import type { Employment } from '@game/jobs';
import type { Location } from '@game/location';
import { INITIAL_NUTRITION, type Nutrition } from '@game/nutrition';
import { INITIAL_READING, type Reading } from '@game/reading';
import { INITIAL_SLEEP, type Sleep } from '@game/sleep';
import type { GameStart } from '@game/time';

// Everything needed to resume a game: plain JSON, no function, no instant of
// the browser (ADR 0002).
export type GameState = Nutrition &
  Sleep &
  Reading & {
    // UTC midnight, in ms, of the Monday of the week the game started in:
    // day 0 of the game
    origin: number;
    // game hours since that Monday 00:00 at which the game started
    startHours: number;
    // game hours since that Monday 00:00; it only moves when the player acts
    elapsedHours: number;
    // day the player was born, YYYY-MM-DD
    birthDate: string;
    // gold coins, whole numbers
    coins: number;
    // where the player is: it decides the actions they can do
    location: Location;
    // what the player did, actions done in a row merged
    history: DoneEntry[];
    // the job the player holds, if any
    job?: Employment;
  };

// What a new game needs: when it starts, and who the player is.
export type NewGame = GameStart & {
  birthDate: string;
};

// A brand new game: the player is at home, jobless and with no coin, and the
// calendar is empty.
export const newGameState = ({
  origin,
  startHours,
  birthDate,
}: NewGame): GameState => ({
  ...INITIAL_NUTRITION,
  ...INITIAL_SLEEP,
  ...INITIAL_READING,
  origin,
  startHours,
  elapsedHours: startHours,
  birthDate,
  coins: 0,
  location: 'home',
  history: [],
});

// The game of the tests and of a provider without a saved game: it starts on
// Monday 1 February 2027 at 07:00.
export const INITIAL_GAME_STATE: GameState = newGameState({
  origin: Date.UTC(2027, 1, 1),
  startHours: 7,
  birthDate: '2009-02-01',
});
