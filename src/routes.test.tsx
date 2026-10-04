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

test('unknown route shows the error page', () => {
  renderApp('/nope');
  expect(screen.getByText('404 Not Found')).toBeInTheDocument();
});
