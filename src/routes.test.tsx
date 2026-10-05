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

test('shows the calories gauge and the gold coins', () => {
  renderApp();
  expect(screen.getByRole('meter', { name: 'Calories' })).toBeInTheDocument();
  expect(screen.getByRole('status', { name: 'Gold coins' })).toHaveTextContent(
    '0',
  );
});

test('a new game starts at home, with the actions of the apartment', () => {
  renderApp();
  expect(screen.getByText('Home', { selector: 'strong' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Look for a job/ })).toBeEnabled();
  expect(screen.getByRole('button', { name: /Sleep 8h/ })).toBeEnabled();
  expect(screen.queryByRole('button', { name: /Go to work/ })).toBeNull();
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

test('the sidebar opens the balance page, with what work paid', async () => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  renderApp();
  await user.click(screen.getByRole('link', { name: 'Balance' }));
  expect(screen.getByRole('heading', { name: 'Balance' })).toBeInTheDocument();
  for (const name of ['Gold coins', 'Earned at work', 'Time worked']) {
    expect(screen.getByText(name)).toBeInTheDocument();
  }
});

test('the sidebar opens the profile page, with the stats of the player', async () => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  renderApp();
  await user.click(screen.getByRole('link', { name: 'Profile' }));
  expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();
  for (const name of ['Dreams', 'Height', 'Weight']) {
    expect(screen.getByText(name)).toBeInTheDocument();
  }
  // the sidebar has its own body gauge, the profile page a second one
  expect(screen.getAllByLabelText('Body fat')).toHaveLength(2);
});

test('the sidebar unfolds the places and opens one with its banner', async () => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  renderApp();
  await user.click(screen.getByRole('button', { name: /Places/ }));
  await user.click(screen.getByRole('link', { name: /Work/ }));
  expect(
    await screen.findByRole('heading', { name: 'Work' }),
  ).toBeInTheDocument();
  // a new game starts at home
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
