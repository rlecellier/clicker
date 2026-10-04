import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { LocationIndicator } from './LocationIndicator';

test.each([
  ['home', 'Home'],
  ['office', 'Office'],
  ['restaurant', 'Restaurant'],
] as const)('shows %s', (location, label) => {
  render(<LocationIndicator location={location} />);
  expect(screen.getByText(label)).toBeInTheDocument();
});
