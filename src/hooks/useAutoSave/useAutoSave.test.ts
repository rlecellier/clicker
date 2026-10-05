import { renderHook } from '@testing-library/react';
import { beforeEach, expect, test } from 'vitest';

import { INITIAL_GAME_STATE } from '@game/gameState';
import { readSave } from '@game/save';

import { useAutoSave } from './useAutoSave';

beforeEach(() => {
  localStorage.clear();
});

const saved = () => readSave(localStorage);

test('saves the game as soon as it changes', () => {
  const { rerender } = renderHook(
    ({ coins }) => {
      useAutoSave({ ...INITIAL_GAME_STATE, coins }, true);
    },
    { initialProps: { coins: 100 } },
  );
  expect(saved()?.coins).toBe(100);

  rerender({ coins: 250 });
  expect(saved()?.coins).toBe(250);
});

test('does nothing when disabled', () => {
  renderHook(() => {
    useAutoSave({ ...INITIAL_GAME_STATE, coins: 300 }, false);
  });
  expect(saved()).toBeUndefined();
});
