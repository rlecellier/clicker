import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { DreamGauge } from './DreamGauge';

test('shows the dream gauge', () => {
  render(<DreamGauge dreamGauge={42.4} dreams={0} />);
  expect(screen.getByRole('meter', { name: 'Dream' })).toHaveAttribute(
    'aria-valuenow',
    '42.4',
  );
  expect(screen.getByText('42%')).toBeInTheDocument();
});

test('counts the dreams made so far', () => {
  const { rerender } = render(<DreamGauge dreamGauge={0} dreams={1} />);
  expect(screen.getByText('1 dream')).toBeInTheDocument();

  rerender(<DreamGauge dreamGauge={0} dreams={3} />);
  expect(screen.getByText('3 dreams')).toBeInTheDocument();
});
