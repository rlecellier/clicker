import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { GameProvider } from '@context/GameContext';
import { totalExpensesCents, expensesBetween } from '@game/expenses';
import { formatMoney } from '@game/money';
import { INITIAL_GAME_STATE } from '@game/gameState';
import { HOURS_PER_DAY, HOURS_PER_WEEK } from '@game/time';

import { BalancePage } from './BalancePage';

// The game clock is frozen: only the state under test counts.
beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'],
  });
});

afterEach(() => {
  vi.useRealTimers();
});

// A game in its sixth week: five weeks have gone by since 1 February 2027.
const LATE_STATE = {
  ...INITIAL_GAME_STATE,
  elapsedHours: 5 * HOURS_PER_WEEK + 12,
};

const setup = () => {
  render(
    <GameProvider initialState={LATE_STATE}>
      <BalancePage />
    </GameProvider>,
  );
};

const money = (cents: number) => formatMoney(cents, { alwaysCents: true });

const swipe = (fromX: number, toX: number) => {
  const page = screen.getByRole('heading', { name: 'Balance' }).parentElement;
  if (page === null) throw new Error('No page');
  fireEvent.touchStart(page, { touches: [{ clientX: fromX, clientY: 0 }] });
  fireEvent.touchEnd(page, { changedTouches: [{ clientX: toX, clientY: 0 }] });
};

test('shows the current week first', () => {
  setup();
  expect(screen.getByRole('tab', { name: 'Week' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(screen.getByText('Expenses this week')).toBeVisible();
});

test('the tabs switch between the week, the month and the year', async () => {
  setup();
  const week = expensesBetween(5 * HOURS_PER_WEEK, LATE_STATE.elapsedHours);
  expect(screen.getByRole('row', { name: /Total/ })).toHaveTextContent(
    money(totalExpensesCents(week)),
  );

  await userEvent.click(screen.getByRole('tab', { name: 'Month' }));
  expect(screen.getByText('Expenses this month')).toBeVisible();
  // the month started on 1 March, day 28
  const month = expensesBetween(28 * HOURS_PER_DAY, LATE_STATE.elapsedHours);
  expect(screen.getByRole('row', { name: /Total/ })).toHaveTextContent(
    money(totalExpensesCents(month)),
  );

  await userEvent.click(screen.getByRole('tab', { name: 'Year' }));
  expect(screen.getByText('Expenses this year')).toBeVisible();
  const year = expensesBetween(0, LATE_STATE.elapsedHours);
  expect(screen.getByRole('row', { name: /Total/ })).toHaveTextContent(
    money(totalExpensesCents(year)),
  );
});

test('swiping left goes to the next period, right to the previous one', () => {
  setup();
  swipe(250, 100);
  expect(screen.getByRole('tab', { name: 'Month' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  swipe(250, 100);
  expect(screen.getByRole('tab', { name: 'Year' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  swipe(100, 250);
  expect(screen.getByRole('tab', { name: 'Month' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('swiping past the first or the last period does nothing', () => {
  setup();
  swipe(100, 250);
  expect(screen.getByRole('tab', { name: 'Week' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});
