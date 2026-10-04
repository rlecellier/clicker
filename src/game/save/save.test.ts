import { expect, test } from 'vitest';

import { INITIAL_GAME_STATE } from '@game/gameState';

import {
  parseSave,
  readSave,
  SAVE_KEY,
  SAVE_VERSION,
  serializeSave,
  writeSave,
  type SaveStorage,
} from './save';

const memoryStorage = (): SaveStorage & { items: Map<string, string> } => {
  const items = new Map<string, string>();
  return {
    items,
    // eslint-disable-next-line unicorn/no-null -- the Storage API returns null
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => {
      items.set(key, value);
    },
  };
};

const state = {
  ...INITIAL_GAME_STATE,
  elapsedHours: 123.5,
  balanceCents: 25_000,
  calories: 61.2,
  fat: 4.5,
  brain: 33.3,
  dreamGauge: 42.5,
  dreams: 3,
  cakeUntil: 120,
};

const broken = (patch: Record<string, unknown>) =>
  parseSave(
    JSON.stringify({ version: SAVE_VERSION, state: { ...state, ...patch } }),
  );

test('a saved game comes back as it was', () => {
  expect(parseSave(serializeSave(state))).toEqual(state);
});

test('the save carries its version', () => {
  expect(JSON.parse(serializeSave(state))).toMatchObject({
    version: SAVE_VERSION,
  });
});

test('refuses anything that is not a save', () => {
  expect(parseSave('')).toBeUndefined();
  expect(parseSave('not json')).toBeUndefined();
  expect(parseSave('null')).toBeUndefined();
  expect(parseSave('42')).toBeUndefined();
  expect(parseSave('{}')).toBeUndefined();
});

test('refuses a save of another version', () => {
  const other = JSON.stringify({ version: SAVE_VERSION + 1, state });
  expect(parseSave(other)).toBeUndefined();
});

test('keeps a balance below zero: the bills are paid anyway', () => {
  expect(broken({ balanceCents: -1500 })).toMatchObject({
    balanceCents: -1500,
  });
});

test('refuses a save with a missing or invalid field', () => {
  expect(broken({ birthDate: undefined })).toBeUndefined();
  expect(broken({ birthDate: '4 October 2008' })).toBeUndefined();
  expect(broken({ balanceCents: 12.5 })).toBeUndefined();
  expect(broken({ expenses: undefined })).toBeUndefined();
  expect(broken({ expenses: { ...state.expenses, rent: -1 } })).toBeUndefined();
  expect(broken({ elapsedHours: '10' })).toBeUndefined();
  expect(broken({ elapsedHours: [] })).toBeUndefined();
  expect(broken({ calories: 101 })).toBeUndefined();
  expect(broken({ speedIndex: 99 })).toBeUndefined();
  expect(broken({ brain: 101 })).toBeUndefined();
  expect(broken({ brain: undefined })).toBeUndefined();
  expect(broken({ dreamGauge: 100 })).toBeUndefined();
  expect(broken({ dreamGauge: undefined })).toBeUndefined();
  expect(broken({ dreams: -1 })).toBeUndefined();
  expect(broken({ dreams: 1.5 })).toBeUndefined();
  expect(broken({ fat: undefined })).toBeUndefined();
});

test('writes then reads the save in the storage', () => {
  const storage = memoryStorage();
  writeSave(storage, state);
  expect(storage.items.has(SAVE_KEY)).toBe(true);
  expect(readSave(storage)).toEqual(state);
});

test('reads nothing when there is no save', () => {
  expect(readSave(memoryStorage())).toBeUndefined();
});

test('keeps going when the storage is blocked', () => {
  const blocked: SaveStorage = {
    getItem: () => {
      throw new Error('blocked');
    },
    setItem: () => {
      throw new Error('blocked');
    },
  };
  expect(readSave(blocked)).toBeUndefined();
  expect(() => {
    writeSave(blocked, state);
  }).not.toThrow();
});
