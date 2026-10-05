import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { expect, test, vi } from 'vitest';

import { INITIAL_COINS } from '@game/coins';
import { FRIDGE_MAX } from '@game/fridge';
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

test('starts at home, jobless, with a few coins and a full fridge by default', () => {
  const { result } = renderGame();
  expect(result.current.coins).toBe(INITIAL_COINS);
  expect(result.current.fridge).toBe(FRIDGE_MAX);
  expect(result.current.job).toBeUndefined();
  expect(result.current.location).toBe('home');
  expect(result.current.history).toEqual([]);
  expect(result.current.activity).toBeUndefined();
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

test('an action runs in real time, one game hour per second', async () => {
  vi.useFakeTimers();
  const { result } = renderGame();
  const { elapsedHours } = result.current;

  act(() => {
    result.current.perform('meal');
  });
  // the time has not jumped: the action is in progress
  expect(result.current.elapsedHours).toBe(elapsedHours);
  expect(result.current.activity).toMatchObject({ title: 'Meal', hours: 1 });

  await act(async () => {
    await vi.advanceTimersByTimeAsync(500);
  });
  expect(result.current.elapsedHours).toBeCloseTo(elapsedHours + 0.5, 1);
  expect(result.current.activity).toBeDefined();

  await act(async () => {
    await vi.advanceTimersByTimeAsync(1000);
  });
  expect(result.current.elapsedHours).toBe(elapsedHours + 1);
  expect(result.current.activity).toBeUndefined();
  expect(result.current.history).toHaveLength(1);
  expect(result.current.calories).not.toBe(INITIAL_CALORIES);
  expect(result.current.fridge).toBe(FRIDGE_MAX - 1);
  vi.useRealTimers();
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

test('looking for a job takes an hour, then the player is hired', async () => {
  vi.useFakeTimers();
  const { result } = renderGame();
  const { elapsedHours } = result.current;

  act(() => {
    result.current.takeJob('clothes-seller');
  });
  expect(result.current.job).toBeUndefined();

  await act(async () => {
    await vi.advanceTimersByTimeAsync(1100);
  });

  expect(result.current.job?.id).toBe('clothes-seller');
  expect(result.current.elapsedHours).toBe(elapsedHours + 1);
  vi.useRealTimers();
});

test('the player goes to work and works during a shift', async () => {
  vi.useFakeTimers();
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
  await act(async () => {
    await vi.advanceTimersByTimeAsync(600);
  });
  expect(result.current.coins).toBe(5);
  expect(result.current.elapsedHours).toBe(8.5);
  vi.useRealTimers();
});

test('restarting gives a brand new game', () => {
  const { result } = renderGame(
    gameStateFactory.build({ traits: ['working'] }),
  );

  act(() => {
    result.current.restart();
  });

  expect(result.current.coins).toBe(INITIAL_COINS);
  expect(result.current.job).toBeUndefined();
  expect(result.current.history).toEqual([]);
});
