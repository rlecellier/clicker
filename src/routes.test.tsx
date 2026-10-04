import { render, screen } from '@testing-library/react';
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

test('unknown route shows the error page', () => {
  renderApp('/nope');
  expect(screen.getByText('404 Not Found')).toBeInTheDocument();
});
