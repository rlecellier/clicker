import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { PlaceBanner } from './PlaceBanner';

test('says the player is here and what they are doing', () => {
  render(<PlaceBanner place="work" location="work" activity="working" />);
  expect(screen.getByRole('status')).toHaveTextContent('You are here');
  expect(screen.getByText('Working')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Work' })).toBeInTheDocument();
});

test('says the player is elsewhere and where they are', () => {
  render(
    <PlaceBanner place="restaurant" location="home" activity="relaxing" />,
  );
  expect(screen.getByRole('status')).toHaveTextContent('You are not here');
  expect(screen.getByText('Home')).toBeInTheDocument();
});
