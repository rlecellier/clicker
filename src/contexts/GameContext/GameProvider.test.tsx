import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { expect, test, vi } from 'vitest';

import { INITIAL_CALORIES } from '@game/nutrition';
import { gameStateFactory } from '@test/factories/gameStateFactory';

import { GameProvider } from './GameProvider';
import { useGameContext } from './useGameContext';

const renderGame = (
  initialState?: Parameters<typeof GameProvider>[0]['initialState'],
) =>
  renderHook(() => useGameContext(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <GameProvider initialState={initialState}>{children}</GameProvider>
    ),
  });

test('starts with the given state', () => {
  const state = gameStateFactory.build();
  const { result } = renderGame(state);
  expect(result.current.coins).toBe(state.coins);
});

test('starts at home, broke and jobless by default', () => {
  const { result } = renderGame();
  expect(result.current.coins).toBe(0);
  expect(result.current.job).toBeUndefined();
  expect(result.current.location).toBe('home');
  expect(result.current.history).toEqual([]);
});

test('needs a provider', () => {
  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  expect(() => renderHook(() => useGameContext())).toThrow(/GameProvider/);
  error.mockRestore();
});

test('time stands still until the player acts', async () => {
  vi.useFakeTimers();
  const { result } = renderGame();
  const { elapsedHours } = result.current;

  await vi.advanceTimersByTimeAsync(60_000);

  expect(result.current.elapsedHours).toBe(elapsedHours);
  vi.useRealTimers();
});

test('an action moves the game clock and fills the history', () => {
  const { result } = renderGame();
  const { elapsedHours } = result.current;

  act(() => {
    result.current.perform('breakfast');
  });

  expect(result.current.elapsedHours).toBe(elapsedHours + 0.5);
  expect(result.current.history).toHaveLength(1);
  expect(result.current.calories).not.toBe(INITIAL_CALORIES);
});

test('offers the actions of the place the player is at', () => {
  const { result } = renderGame();
  expect(result.current.actions.map(({ action }) => action.id)).toContain(
    'sleep-8',
  );
  expect(result.current.actions.map(({ action }) => action.id)).not.toContain(
    'work',
  );
});

test('looking for a job takes the job and an hour', () => {
  const { result } = renderGame();
  const { elapsedHours } = result.current;

  act(() => {
    result.current.takeJob('clothes-seller');
  });

  expect(result.current.job?.id).toBe('clothes-seller');
  expect(result.current.elapsedHours).toBe(elapsedHours + 1);
});

test('the player goes to work and works during a shift', () => {
  // Monday 08:00, a clothes seller
  const { result } = renderGame(
    gameStateFactory.build({
      traits: ['working'],
      overrides: { elapsedHours: 8, coins: 0 },
    }),
  );

  act(() => {
    result.current.goTo('work');
  });
  expect(result.current.location).toBe('work');
  expect(result.current.currentShift?.id).toBe('work-morning');

  act(() => {
    result.current.perform('work');
  });
  expect(result.current.coins).toBe(5);
  expect(result.current.elapsedHours).toBe(8.5);
});

test('restarting gives a brand new game', () => {
  const { result } = renderGame(
    gameStateFactory.build({ traits: ['working'] }),
  );

  act(() => {
    result.current.restart();
  });

  expect(result.current.coins).toBe(0);
  expect(result.current.job).toBeUndefined();
  expect(result.current.history).toEqual([]);
});
