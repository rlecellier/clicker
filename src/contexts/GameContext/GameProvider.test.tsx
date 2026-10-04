import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { totalExpensesCents } from '@game/expenses';
import { INITIAL_CALORIES, SNACK_CALORIES } from '@game/nutrition';
import { DEFAULT_SPEED, HOURS_PER_SECOND, HOURS_PER_WEEK } from '@game/time';
import { gameStateFactory } from '@test/factories/gameStateFactory';
import { WORKING_STATE } from '@test/schedules';

import { GameProvider } from './GameProvider';
import type { GameContextValue } from './types';
import { useGameContext } from './useGameContext';

// Real milliseconds needed for the game to run the given number of hours.
const hoursToMs = (hours: number) =>
  (hours * 1000) / (HOURS_PER_SECOND * DEFAULT_SPEED);

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'],
  });
});

afterEach(() => {
  vi.useRealTimers();
});

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
  expect(result.current.balanceCents).toBe(state.balanceCents);
});

test('starts broke by default', () => {
  const { result } = renderGame();
  expect(result.current.balanceCents).toBe(0);
});

test('needs a provider', () => {
  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  expect(() => renderHook(() => useGameContext())).toThrow(/GameProvider/);
  error.mockRestore();
});

test('a snack adds calories at once', () => {
  const { result } = renderGame();

  act(() => {
    result.current.snack();
  });

  expect(result.current.calories).toBe(INITIAL_CALORIES + SNACK_CALORIES);
});

test('calories go down during the night', () => {
  const { result } = renderGame();

  act(() => {
    vi.advanceTimersByTime(hoursToMs(6));
  });

  expect(result.current.calories).toBeLessThan(INITIAL_CALORIES);
});

test('enjoying a cake lasts 30 game minutes', () => {
  const { result } = renderGame();

  act(() => {
    result.current.cake();
  });
  act(() => {
    vi.advanceTimersByTime(hoursToMs(0.25));
  });
  expect(result.current.isEnjoyingCake).toBe(true);

  act(() => {
    vi.advanceTimersByTime(hoursToMs(0.5));
  });
  expect(result.current.isEnjoyingCake).toBe(false);
});

// Salary banked so far: the balance before the bills were paid.
const earnedCents = (game: GameContextValue) =>
  game.balanceCents + totalExpensesCents(game.expenses);

test('earns the weekly pay while working, banked once the week ends', () => {
  const { result } = renderGame(
    gameStateFactory.build({
      overrides: { ...WORKING_STATE, balanceCents: 0 },
    }),
  );

  act(() => {
    vi.advanceTimersByTime(hoursToMs(18.5));
  });
  expect(result.current.isEarning).toBe(false);
  expect(result.current.pendingPayCents).toBeGreaterThan(0);
  expect(earnedCents(result.current)).toBe(0);

  act(() => {
    vi.advanceTimersByTime(hoursToMs(HOURS_PER_WEEK - 18.5) + 100);
  });
  expect(earnedCents(result.current)).toBe(25_000);
  expect(result.current.pendingPayCents).toBe(0);
});

test('speeding up the time brings the end of the week closer', () => {
  const { result } = renderGame(
    gameStateFactory.build({
      overrides: { ...WORKING_STATE, balanceCents: 0 },
    }),
  );

  act(() => {
    result.current.faster();
  });
  act(() => {
    vi.advanceTimersByTime(hoursToMs(HOURS_PER_WEEK / 2) + 100);
  });

  expect(result.current.speed).toBe(DEFAULT_SPEED * 2);
  expect(earnedCents(result.current)).toBe(25_000);
});

test('slowing down stops at the slowest speed', () => {
  const { result } = renderGame();

  act(() => {
    for (let index = 0; index < 20; index += 1) result.current.slower();
  });

  expect(result.current.canSlowDown).toBe(false);
});

test('takes a job, which plans the work and pays for it', () => {
  const { result } = renderGame();
  expect(result.current.job).toBeUndefined();

  act(() => {
    result.current.takeJob('clothes-seller');
  });

  expect(result.current.job?.id).toBe('clothes-seller');
  expect(result.current.obligations.map((event) => event.title)).toContain(
    'Sell clothes',
  );
  expect(result.current.schedule.plan.map((event) => event.title)).toContain(
    'Go to work',
  );
});

test('an ask event pauses the game until the player answers', () => {
  const { result } = renderGame(
    gameStateFactory.build({
      overrides: {
        ...WORKING_STATE,
        plan: [
          ...WORKING_STATE.plan,
          {
            id: 'read-ask',
            title: 'Read a book',
            kind: 'read',
            mode: 'ask',
            recurrence: { type: 'weekly', days: [0, 1, 2, 3, 4, 5, 6] },
            start: 20,
            end: 22,
          },
        ],
      },
    }),
  );

  act(() => {
    vi.advanceTimersByTime(hoursToMs(21));
  });
  expect(result.current.asking?.event.id).toBe('read-ask');
  expect(result.current.elapsedHours).toBe(20);

  act(() => {
    vi.advanceTimersByTime(hoursToMs(5));
  });
  expect(result.current.elapsedHours).toBe(20);

  act(() => {
    result.current.answerAsk(true);
  });
  act(() => {
    vi.advanceTimersByTime(hoursToMs(1));
  });
  expect(result.current.asking).toBeUndefined();
  expect(result.current.isReadingNow).toBe(true);
});
