import { CALORIES_CAP } from '@game/nutrition';
import { SPEEDS } from '@game/time';
import type { GameState } from '@game/gameState';

export const SAVE_KEY = 'clicker.save';
// Bumped when the shape of `GameState` changes in a way old saves can't fit.
export const SAVE_VERSION = 1;

// The part of `Storage` the save needs, so it can be faked in tests.
export type SaveStorage = Pick<Storage, 'getItem' | 'setItem'>;

const isBetweenZeroAnd = (value: unknown, max: number) =>
  typeof value === 'number' &&
  Number.isFinite(value) &&
  value >= 0 &&
  value <= max;

// A save comes from outside: it is checked before it becomes a game.
const isGameState = (value: unknown): value is GameState => {
  if (typeof value !== 'object' || value === null) return false;
  const state = value as Record<string, unknown>;
  return (
    isBetweenZeroAnd(state.elapsedHours, Number.MAX_SAFE_INTEGER) &&
    Number.isSafeInteger(state.speedIndex) &&
    isBetweenZeroAnd(state.speedIndex, SPEEDS.length - 1) &&
    Number.isSafeInteger(state.balanceCents) &&
    isBetweenZeroAnd(state.balanceCents, Number.MAX_SAFE_INTEGER) &&
    isBetweenZeroAnd(state.calories, CALORIES_CAP) &&
    isBetweenZeroAnd(state.fat, Number.MAX_SAFE_INTEGER) &&
    isBetweenZeroAnd(state.cakeUntil, Number.MAX_SAFE_INTEGER)
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
