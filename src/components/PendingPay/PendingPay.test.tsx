import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { PendingPay } from './PendingPay';

test('shows the pay waiting to be paid with cents', () => {
  render(<PendingPay cents={1250} isEarning={false} />);
  expect(screen.getByText('+$12.50')).toBeInTheDocument();
  expect(screen.getByText('pay of the week')).toBeInTheDocument();
});

test('says it is earning during a work event', () => {
  render(<PendingPay cents={1250} isEarning />);
  expect(screen.getByText(/earning/)).toBeInTheDocument();
});
