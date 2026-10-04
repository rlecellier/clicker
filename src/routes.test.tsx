import { act, render, screen } from '@testing-library/react';
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

test('work gives $1 per click', async () => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  renderApp();
  await user.click(screen.getByRole('button', { name: /^Work \(/ }));
  await user.click(screen.getByRole('button', { name: /^Work \(/ }));
  expect(screen.getByText('$2')).toBeInTheDocument();
});

test('working day disables actions for 5s then pays $10', async () => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  renderApp();
  await user.click(screen.getByRole('button', { name: /Working day/ }));

  expect(screen.getByRole('button', { name: /^Work \(/ })).toBeDisabled();
  expect(screen.getByRole('button', { name: /Working day/ })).toBeDisabled();

  await act(async () => {
    await vi.advanceTimersByTimeAsync(5100);
  });

  expect(screen.getByText('$10')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^Work \(/ })).toBeEnabled();
});

test('unknown route shows the error page', () => {
  renderApp('/nope');
  expect(screen.getByText('404 Not Found')).toBeInTheDocument();
});
