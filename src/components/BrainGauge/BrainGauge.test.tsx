import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { BrainGauge } from './BrainGauge';

test('shows the brain gauge', () => {
  render(<BrainGauge brain={42.4} isSleeping={false} />);
  expect(screen.getByRole('meter', { name: 'Brain' })).toHaveAttribute(
    'aria-valuenow',
    '42.4',
  );
  expect(screen.getByText('42%')).toBeInTheDocument();
});

test('says so while asleep', () => {
  const { rerender } = render(<BrainGauge brain={50} isSleeping={false} />);
  expect(screen.queryByText('Asleep')).not.toBeInTheDocument();

  rerender(<BrainGauge brain={50} isSleeping />);
  expect(screen.getByText('Asleep')).toBeInTheDocument();
});
