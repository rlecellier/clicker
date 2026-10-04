import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import type { CaloriesStatus as Status } from '@game/nutrition';

import { CaloriesStatus } from './CaloriesStatus';

test('is always shown, even when the calories are fine', () => {
  render(<CaloriesStatus status="good" />);
  expect(
    screen.getByRole('button', { name: 'Calories status' }),
  ).toHaveAttribute('data-status', 'good');
});

test.each<[Status, string]>([
  ['starving', 'Out of energy'],
  ['running-low', 'Running low'],
  ['good', 'Well fed'],
  ['running-high', 'Getting too much'],
  ['overflowing', 'Too much energy'],
])('explains the %s state when clicked', async (status, title) => {
  const user = userEvent.setup();
  render(<CaloriesStatus status={status} />);
  expect(screen.queryByText(title)).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Calories status' }));
  expect(screen.getByText(title)).toBeInTheDocument();
});
