import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { GameProvider } from '@context/GameContext';
import { gameStateFactory } from '@test/factories/gameStateFactory';

import { CalendarPage } from './CalendarPage';

// The game clock stays still, so that the current day does not change under
// the test.
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const LARGE_SCREEN = '(min-width: 640px)';

const useScreen = (isLarge: boolean) => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query === LARGE_SCREEN && isLarge,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
};

// Wednesday 3 February 2027
const renderPage = () =>
  render(
    <GameProvider
      initialState={gameStateFactory.build({ overrides: { elapsedHours: 52 } })}
    >
      <CalendarPage />
    </GameProvider>,
  );

const swipe = (from: number, to: number) => {
  const grid = screen.getAllByRole('list')[0]?.closest('[class*="grid"]');
  fireEvent.touchStart(grid as Element, {
    touches: [{ clientX: from, clientY: 100 }],
  });
  fireEvent.touchEnd(grid as Element, {
    changedTouches: [{ clientX: to, clientY: 100 }],
  });
};

test('shows the whole week on a large screen', () => {
  useScreen(true);
  renderPage();
  expect(screen.getAllByRole('list')).toHaveLength(7);
  expect(screen.getByRole('heading', { name: '1 – 7 Feb 2027' })).toBeVisible();
});

test('the view toggle switches between the week and the day', () => {
  useScreen(true);
  renderPage();
  const week = screen.getByRole('button', { name: 'Week' });
  const day = screen.getByRole('button', { name: 'Day' });
  expect(week).toHaveAttribute('aria-pressed', 'true');

  fireEvent.click(day);
  expect(day).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getAllByRole('list')).toHaveLength(1);
  expect(screen.getByRole('list', { name: 'Wed 3' })).toBeInTheDocument();
});

test('the arrows move by a week in the week view, by a day in the day view', () => {
  useScreen(true);
  renderPage();
  fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
  fireEvent.click(screen.getByRole('button', { name: 'Next week' }));
  expect(
    screen.getByRole('heading', { name: '8 – 14 Feb 2027' }),
  ).toBeVisible();

  fireEvent.click(screen.getByRole('button', { name: 'Day' }));
  fireEvent.click(screen.getByRole('button', { name: 'Next day' }));
  expect(screen.getByRole('list', { name: 'Thu 11' })).toBeInTheDocument();
});

test('has no previous week before the start of the game', () => {
  useScreen(true);
  render(
    <GameProvider
      initialState={gameStateFactory.build({ overrides: { elapsedHours: 0 } })}
    >
      <CalendarPage />
    </GameProvider>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
  expect(screen.getByRole('button', { name: 'Previous week' })).toBeDisabled();
});

test('shows a single day on mobile, without the view toggle', () => {
  useScreen(false);
  renderPage();
  expect(screen.getAllByRole('list')).toHaveLength(1);
  expect(screen.getByRole('list', { name: 'Wed 3' })).toBeInTheDocument();
  expect(screen.queryByRole('group', { name: 'View' })).not.toBeInTheDocument();
});

test('swipes from one day to the next on mobile', () => {
  useScreen(false);
  renderPage();
  fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
  swipe(250, 100);
  expect(screen.getByRole('list', { name: 'Thu 4' })).toBeInTheDocument();
  swipe(100, 250);
  swipe(100, 250);
  expect(screen.getByRole('list', { name: 'Tue 2' })).toBeInTheDocument();
});

test('playing follows the current day and locks the navigation', () => {
  useScreen(false);
  renderPage();
  expect(screen.getByRole('button', { name: 'Next day' })).toBeDisabled();
  swipe(250, 100);
  expect(screen.getByRole('list', { name: 'Wed 3' })).toBeInTheDocument();
});

test('play comes back to the current day, pause frees the navigation', () => {
  useScreen(false);
  renderPage();
  fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
  swipe(250, 100);
  expect(screen.getByRole('list', { name: 'Thu 4' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Play' }));
  expect(screen.getByRole('list', { name: 'Wed 3' })).toBeInTheDocument();
});
