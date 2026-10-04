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

test('flags calories outside of the 20%–80% range', () => {
  const { rerender } = render(<CaloriesGauge calories={50} fat={0} />);
  expect(screen.getByText('50%')).toHaveAttribute('data-balanced');

  rerender(<CaloriesGauge calories={85} fat={0} />);
  expect(screen.getByText('85%')).not.toHaveAttribute('data-balanced');

  rerender(<CaloriesGauge calories={10} fat={0} />);
  expect(screen.getByText('10%')).not.toHaveAttribute('data-balanced');
});
