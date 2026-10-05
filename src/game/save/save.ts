import { isDoneEntry } from '@game/history';
import { isJobId } from '@game/jobs';
import { isLocation } from '@game/location';
import { CALORIES_CAP } from '@game/nutrition';
import { getBook } from '@game/reading';
import { BRAIN_CAP, DREAM_CAP } from '@game/sleep';
import type { GameState } from '@game/gameState';

export const SAVE_KEY = 'clicker.save';
// Bumped when the shape of `GameState` changes in a way old saves can't fit.
export const SAVE_VERSION = 7;

// The part of `Storage` the save needs, so it can be faked in tests.
export type SaveStorage = Pick<Storage, 'getItem' | 'setItem'>;

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

const isBetweenZeroAnd = (value: unknown, max: number) =>
  typeof value === 'number' &&
  Number.isFinite(value) &&
  value >= 0 &&
  value <= max;

const isBookId = (value: unknown) => getBook(value as string) !== undefined;

// Each book is read once: ids are known, distinct, and not the current one.
const isReadBookIds = (value: unknown, currentId: unknown) =>
  Array.isArray(value) &&
  value.every(
    (id, index) =>
      isBookId(id) && id !== currentId && value.indexOf(id) === index,
  );

// The book on the go, with the hours read so far: no book, no hours.
const isCurrentBook = (id: unknown, hours: unknown) =>
  id === undefined
    ? hours === 0
    : isBookId(id) &&
      isBetweenZeroAnd(hours, getBook(id as string)?.hours ?? 0);

const isEmployment = (value: unknown) =>
  value === undefined ||
  (typeof value === 'object' &&
    value !== null &&
    isJobId((value as Record<string, unknown>).id) &&
    isBetweenZeroAnd(
      (value as Record<string, unknown>).since,
      Number.MAX_SAFE_INTEGER,
    ));

// A save comes from outside: it is checked before it becomes a game.
const isGameState = (value: unknown): value is GameState => {
  if (typeof value !== 'object' || value === null) return false;
  const state = value as Record<string, unknown>;
  return (
    typeof state.birthDate === 'string' &&
    ISO_DAY.test(state.birthDate) &&
    Number.isFinite(state.origin) &&
    isBetweenZeroAnd(state.startHours, Number.MAX_SAFE_INTEGER) &&
    isBetweenZeroAnd(state.elapsedHours, Number.MAX_SAFE_INTEGER) &&
    // the game never goes back before its start
    (state.elapsedHours as number) >= (state.startHours as number) &&
    Number.isSafeInteger(state.coins) &&
    isBetweenZeroAnd(state.coins, Number.MAX_SAFE_INTEGER) &&
    isLocation(state.location as string | undefined) &&
    isBetweenZeroAnd(state.calories, CALORIES_CAP) &&
    isBetweenZeroAnd(state.brain, BRAIN_CAP) &&
    isBetweenZeroAnd(state.dreamGauge, DREAM_CAP) &&
    // a full gauge has already made its dream
    (state.dreamGauge as number) < DREAM_CAP &&
    Number.isSafeInteger(state.dreams) &&
    isBetweenZeroAnd(state.dreams, Number.MAX_SAFE_INTEGER) &&
    isBetweenZeroAnd(state.fat, Number.MAX_SAFE_INTEGER) &&
    isCurrentBook(state.bookId, state.bookHours) &&
    isReadBookIds(state.readBookIds, state.bookId) &&
    Array.isArray(state.history) &&
    state.history.every(isDoneEntry) &&
    // a state with a job is at work only if the job is there to go to
    (state.location !== 'work' || state.job !== undefined) &&
    isEmployment(state.job)
  );
};

export const serializeSave = (state: GameState) =>
  JSON.stringify({ version: SAVE_VERSION, state });

// Returns undefined for anything that is not a valid save of this version.
export const parseSave = (text: string): GameState | undefined => {
  try {
    const save: unknown = JSON.parse(text);
    if (typeof save !== 'object' || save === null) return undefined;
    const { version, state } = save as { version?: unknown; state?: unknown };
    return version !== SAVE_VERSION || !isGameState(state) ? undefined : state;
  } catch {
    return undefined;
  }
};

export const readSave = (storage: SaveStorage) => {
  try {
    const text = storage.getItem(SAVE_KEY);
    return text === null ? undefined : parseSave(text);
  } catch {
    // storage can be blocked (private mode, disabled cookies)
    return;
  }
};

export const writeSave = (storage: SaveStorage, state: GameState) => {
  try {
    storage.setItem(SAVE_KEY, serializeSave(state));
  } catch {
    // quota exceeded or blocked: the game goes on without saving
  }
};
