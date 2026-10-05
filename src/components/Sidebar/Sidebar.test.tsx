import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { expect, test, vi } from 'vitest';

import { getBody } from '@game/body';

import { Sidebar } from './Sidebar';

const renderPanel = (isOpen: boolean) => {
  const onClose = vi.fn();
  const onRestart = vi.fn();
  render(
    <MemoryRouter>
      <Sidebar
        id="panel"
        calories={50}
        fridge={10}
        body={getBody(0)}
        brain={30}
        dreamGauge={20}
        dreams={2}
        isOpen={isOpen}
        onClose={onClose}
        onRestart={onRestart}
      />
    </MemoryRouter>,
  );
  return { onClose, onRestart };
};

test('contains the calories, brain, dream and body gauges', () => {
  renderPanel(false);
  expect(screen.getByRole('meter', { name: 'Calories' })).toBeInTheDocument();
  expect(screen.getByRole('meter', { name: 'Brain' })).toBeInTheDocument();
  expect(screen.getByRole('meter', { name: 'Dream' })).toBeInTheDocument();
  expect(screen.getByLabelText('Body fat')).toBeInTheDocument();
  expect(screen.getByText('Fat 20%')).toBeInTheDocument();
  expect(screen.getByText('Muscle 80%')).toBeInTheDocument();
});

test('is marked as open only when it is open', () => {
  const { container } = render(
    <MemoryRouter>
      <Sidebar
        id="panel"
        calories={50}
        fridge={10}
        body={getBody(0)}
        brain={30}
        dreamGauge={20}
        dreams={2}
        isOpen
        onClose={vi.fn()}
        onRestart={vi.fn()}
      />
    </MemoryRouter>,
  );
  expect(container.querySelector('#panel')).toHaveAttribute('data-open');
});

test('closes when the backdrop is clicked', async () => {
  const user = userEvent.setup();
  const { onClose } = renderPanel(true);
  // the backdrop is decorative, so it has no role: reach it from the panel
  const backdrop = screen.getByRole('complementary').previousElementSibling;
  await user.click(backdrop as Element);
  expect(onClose).toHaveBeenCalledOnce();
});

test('closes on Escape when it is open', async () => {
  const user = userEvent.setup();
  const { onClose } = renderPanel(true);
  await user.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalledOnce();
});

test('ignores Escape when it is closed', async () => {
  const user = userEvent.setup();
  const { onClose } = renderPanel(false);
  await user.keyboard('{Escape}');
  expect(onClose).not.toHaveBeenCalled();
});

test('links to the game, the calendar and the balance', () => {
  renderPanel(false);
  expect(screen.getByRole('link', { name: 'Game' })).toHaveAttribute(
    'href',
    '/',
  );
  expect(screen.getByRole('link', { name: 'Calendar' })).toHaveAttribute(
    'href',
    '/calendar',
  );
  expect(screen.getByRole('link', { name: 'Balance' })).toHaveAttribute(
    'href',
    '/balance',
  );
});

test('marks the current page and closes when a link is clicked', async () => {
  const user = userEvent.setup();
  const { onClose } = renderPanel(true);
  expect(screen.getByRole('link', { name: 'Game' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await user.click(screen.getByRole('link', { name: 'Balance' }));
  expect(onClose).toHaveBeenCalled();
});

test('links to the places page', () => {
  renderPanel(false);
  expect(screen.getByRole('link', { name: 'Places' })).toHaveAttribute(
    'href',
    '/places',
  );
});

test('restarts the game and closes when Restart Game is clicked', async () => {
  const user = userEvent.setup();
  const { onClose, onRestart } = renderPanel(true);
  await user.click(screen.getByRole('button', { name: 'Restart Game' }));
  expect(onRestart).toHaveBeenCalledOnce();
  expect(onClose).toHaveBeenCalled();
});
