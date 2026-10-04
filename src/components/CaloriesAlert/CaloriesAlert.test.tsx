import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { CaloriesAlert } from './CaloriesAlert';

test('shows nothing when the calories are balanced', () => {
  render(<CaloriesAlert level="balanced" />);
  expect(
    screen.queryByRole('button', { name: 'Calories alert' }),
  ).not.toBeInTheDocument();
});

test('explains in a dropdown that the calories are too low', async () => {
  const user = userEvent.setup();
  render(<CaloriesAlert level="low" />);
  expect(screen.queryByText('Calories too low')).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Calories alert' }));
  expect(screen.getByText('Calories too low')).toBeInTheDocument();
  expect(screen.getByText(/Below 20%/)).toBeInTheDocument();
});

test('explains in a dropdown that the calories are too high', async () => {
  const user = userEvent.setup();
  render(<CaloriesAlert level="high" />);

  await user.click(screen.getByRole('button', { name: 'Calories alert' }));
  expect(screen.getByText('Calories too high')).toBeInTheDocument();
  expect(screen.getByText(/Above 80%/)).toBeInTheDocument();
});
