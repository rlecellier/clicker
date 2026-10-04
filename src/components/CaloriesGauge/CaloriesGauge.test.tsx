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

test('colors the gauge by level: low below 20%, high above 80%', () => {
  const { rerender } = render(<CaloriesGauge calories={50} fat={0} />);
  expect(screen.getByText('50%')).toHaveAttribute('data-level', 'balanced');

  rerender(<CaloriesGauge calories={85} fat={0} />);
  expect(screen.getByText('85%')).toHaveAttribute('data-level', 'high');

  rerender(<CaloriesGauge calories={10} fat={0} />);
  expect(screen.getByText('10%')).toHaveAttribute('data-level', 'low');

  rerender(<CaloriesGauge calories={20} fat={0} />);
  expect(screen.getByText('20%')).toHaveAttribute('data-level', 'balanced');

  rerender(<CaloriesGauge calories={80} fat={0} />);
  expect(screen.getByText('80%')).toHaveAttribute('data-level', 'balanced');
});
