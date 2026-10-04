import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { expect, test } from 'vitest';

import { routes } from './routes';

function renderApp(path = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(<RouterProvider router={router} />);
}

test('unknown route shows the error page', () => {
  renderApp('/nope');
  expect(screen.getByText('404 Not Found')).toBeInTheDocument();
});
