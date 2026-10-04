import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { INITIAL_GAME_STATE } from '@game/gameState';
import { readSave } from '@game/save';

import { AUTO_SAVE_INTERVAL_MS, useAutoSave } from './useAutoSave';

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

const saved = () => readSave(localStorage);

test('saves the latest state every few seconds', () => {
  const { rerender } = renderHook(
    ({ balanceCents }) => {
      useAutoSave({ ...INITIAL_GAME_STATE, balanceCents }, true);
    },
    { initialProps: { balanceCents: 100 } },
  );
  expect(saved()).toBeUndefined();

  rerender({ balanceCents: 250 });
  vi.advanceTimersByTime(AUTO_SAVE_INTERVAL_MS);

  expect(saved()?.balanceCents).toBe(250);
});

test('saves when the page is hidden', () => {
  renderHook(() => {
    useAutoSave({ ...INITIAL_GAME_STATE, balanceCents: 700 }, true);
  });
  vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');

  document.dispatchEvent(new Event('visibilitychange'));

  expect(saved()?.balanceCents).toBe(700);
});

test('saves when the page is closed', () => {
  renderHook(() => {
    useAutoSave({ ...INITIAL_GAME_STATE, balanceCents: 900 }, true);
  });

  dispatchEvent(new Event('pagehide'));

  expect(saved()?.balanceCents).toBe(900);
});

test('does nothing when disabled', () => {
  const { unmount } = renderHook(() => {
    useAutoSave({ ...INITIAL_GAME_STATE, balanceCents: 300 }, false);
  });

  vi.advanceTimersByTime(AUTO_SAVE_INTERVAL_MS * 2);
  dispatchEvent(new Event('pagehide'));
  unmount();

  expect(saved()).toBeUndefined();
});
