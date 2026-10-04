import { EXPENSE_IDS } from '@game/expenses';
import { CALORIES_CAP } from '@game/nutrition';
import { BOOK_HOURS } from '@game/reading';
import { BRAIN_CAP, DREAM_CAP } from '@game/sleep';
import { SPEEDS } from '@game/time';
import type { GameState } from '@game/gameState';

export const SAVE_KEY = 'clicker.save';
// Bumped when the shape of `GameState` changes in a way old saves can't fit.
export const SAVE_VERSION = 4;

// The part of `Storage` the save needs, so it can be faked in tests.
export type SaveStorage = Pick<Storage, 'getItem' | 'setItem'>;

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

const isBetweenZeroAnd = (value: unknown, max: number) =>
  typeof value === 'number' &&
  Number.isFinite(value) &&
  value >= 0 &&
  value <= max;

const isExpenses = (value: unknown) =>
  typeof value === 'object' &&
  value !== null &&
  EXPENSE_IDS.every((id) =>
    isBetweenZeroAnd(
      (value as Record<string, unknown>)[id],
      Number.MAX_SAFE_INTEGER,
    ),
  );

// A save comes from outside: it is checked before it becomes a game.
const isGameState = (value: unknown): value is GameState => {
  if (typeof value !== 'object' || value === null) return false;
  const state = value as Record<string, unknown>;
  return (
    typeof state.birthDate === 'string' &&
    ISO_DAY.test(state.birthDate) &&
    isBetweenZeroAnd(state.elapsedHours, Number.MAX_SAFE_INTEGER) &&
    Number.isSafeInteger(state.speedIndex) &&
    isBetweenZeroAnd(state.speedIndex, SPEEDS.length - 1) &&
    Number.isSafeInteger(state.balanceCents) &&
    // bills can push the balance below zero
    Math.abs(state.balanceCents as number) <= Number.MAX_SAFE_INTEGER &&
    isExpenses(state.expenses) &&
    isBetweenZeroAnd(state.calories, CALORIES_CAP) &&
    isBetweenZeroAnd(state.brain, BRAIN_CAP) &&
    isBetweenZeroAnd(state.dreamGauge, DREAM_CAP) &&
    // a full gauge has already made its dream
    (state.dreamGauge as number) < DREAM_CAP &&
    Number.isSafeInteger(state.dreams) &&
    isBetweenZeroAnd(state.dreams, Number.MAX_SAFE_INTEGER) &&
    isBetweenZeroAnd(state.fat, Number.MAX_SAFE_INTEGER) &&
    isBetweenZeroAnd(state.cakeUntil, Number.MAX_SAFE_INTEGER) &&
    isBetweenZeroAnd(state.bookHours, BOOK_HOURS) &&
    typeof state.isReading === 'boolean'
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
