import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { CaloriesGauge } from './CaloriesGauge';

test('shows the calories and the fat', () => {
  render(<CaloriesGauge calories={42.4} fat={3.17} />);
  expect(screen.getByRole('meter', { name: 'Calories' })).toHaveAttribute(
    'aria-valuenow',
    '42.4',
  );
  expect(screen.getByText('42%')).toBeInTheDocument();
  expect(screen.getByText('Fat 3.2')).toBeInTheDocument();
});

test.each([
  [50, 'good'],
  [40, 'good'],
  [60, 'good'],
  [30, 'running-low'],
  [20, 'running-low'],
  [70, 'running-high'],
  [80, 'running-high'],
  [10, 'starving'],
  [85, 'overflowing'],
])('colors the gauge at %s%% as %s', (calories, status) => {
  render(<CaloriesGauge calories={calories} fat={0} />);
  expect(screen.getByText(`${calories}%`)).toHaveAttribute(
    'data-status',
    status,
  );
});
