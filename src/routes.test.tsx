import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { createMemoryRouter, RouterProvider } from 'react-router';

import { routes } from './routes';

const renderApp = (path = '/') => {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(<RouterProvider router={router} />);
};

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

test('the cake can be enjoyed once at a time', async () => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  renderApp();
  await user.click(screen.getByRole('button', { name: /Enjoy a cake/ }));
  expect(
    screen.getByRole('button', { name: /Enjoying a cake/ }),
  ).toBeDisabled();
});

test('shows the calories gauge and the snack action', () => {
  renderApp();
  expect(screen.getByRole('meter', { name: 'Calories' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Eat a snack/ })).toBeEnabled();
});

test('shows the brain gauge', () => {
  renderApp();
  expect(screen.getByRole('meter', { name: 'Brain' })).toBeInTheDocument();
});

test('the menu button opens and closes the gauges sidebar', async () => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  renderApp();
  const menu = screen.getByRole('button', { name: 'Menu' });
  expect(menu).toHaveAttribute('aria-expanded', 'false');

  await user.click(menu);
  expect(menu).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('complementary')).toHaveAttribute('data-open');

  await user.keyboard('{Escape}');
  expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('the sidebar opens the balance page, with the rent and the meals', async () => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  renderApp();
  await user.click(screen.getByRole('link', { name: 'Balance' }));
  expect(screen.getByRole('heading', { name: 'Balance' })).toBeInTheDocument();
  for (const name of ['Rent', 'Breakfast', 'Lunch', 'Dinner']) {
    expect(screen.getByRole('rowheader', { name })).toBeInTheDocument();
  }
});

test('the sidebar opens the profile page, with the stats of the player', async () => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  renderApp();
  await user.click(screen.getByRole('link', { name: 'Profile' }));
  expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();
  for (const name of ['Dreams', 'Height', 'Weight', 'Fat', 'Muscle']) {
    expect(screen.getByText(name)).toBeInTheDocument();
  }
});

test('the sidebar unfolds the places and opens one with its banner', async () => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  renderApp();
  await user.click(screen.getByRole('button', { name: /Places/ }));
  await user.click(screen.getByRole('link', { name: /Restaurant/ }));
  expect(
    await screen.findByRole('heading', { name: 'Restaurant' }),
  ).toBeInTheDocument();
  // a new game starts asleep at home
  expect(screen.getByText('You are not here')).toBeInTheDocument();
});

test('an unknown place shows the error page', async () => {
  renderApp('/places/moon');
  expect(await screen.findByText('404 Not Found')).toBeInTheDocument();
});

test('the sidebar opens the calendar page, one day at a time on mobile', async () => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  renderApp();
  await user.click(screen.getByRole('link', { name: 'Calendar' }));
  const calendar = screen.getByRole('region', { name: 'Calendar' });
  expect(within(calendar).getAllByRole('list')).toHaveLength(1);
});

test('unknown route shows the error page', () => {
  renderApp('/nope');
  expect(screen.getByText('404 Not Found')).toBeInTheDocument();
});
