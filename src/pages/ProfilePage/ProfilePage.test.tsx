import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { GameProvider } from '@context/GameContext';
import { gameStateFactory } from '@test/factories/gameStateFactory';

import { ProfilePage } from './ProfilePage';

// The game clock stays still, so that the stats do not change under the test.
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const renderPage = (state = gameStateFactory.build()) =>
  render(
    <GameProvider initialState={state}>
      <ProfilePage />
    </GameProvider>,
  );

const statOf = (name: string) =>
  screen.getByText(name).parentElement as HTMLElement;

test('shows the dreams of the player', () => {
  renderPage(gameStateFactory.build({ overrides: { dreams: 7 } }));
  expect(statOf('Dreams')).toHaveTextContent('7');
});

test('a new player is the reference one', () => {
  renderPage(gameStateFactory.build({ overrides: { fat: 0 } }));
  expect(statOf('Height')).toHaveTextContent('1.70 m');
  expect(statOf('Weight')).toHaveTextContent('70.0 kg');
  expect(screen.getByText('Fat 20%')).toBeInTheDocument();
  expect(screen.getByText('Muscle 80%')).toBeInTheDocument();
});

test('fat makes the player heavier', () => {
  renderPage(gameStateFactory.build({ overrides: { fat: 100 } }));
  expect(statOf('Weight')).toHaveTextContent('75.0 kg');
  expect(screen.getByText('Fat 25%')).toBeInTheDocument();
  expect(screen.getByText('Muscle 75%')).toBeInTheDocument();
});
