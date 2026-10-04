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
        balanceCents={1250}
        calories={50}
        body={getBody(0)}
        brain={30}
        dreamGauge={20}
        dreams={2}
        isSleeping={false}
        location="home"
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
        balanceCents={1250}
        calories={50}
        body={getBody(0)}
        brain={30}
        dreamGauge={20}
        dreams={2}
        isSleeping={false}
        location="home"
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

test('unfolds the places and links to each of them', async () => {
  const user = userEvent.setup();
  renderPanel(true);
  const toggle = screen.getByRole('button', { name: /Places/ });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');

  await user.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  for (const [name, place] of [
    ['Home', 'home'],
    ['Work', 'work'],
    ['Restaurant', 'restaurant'],
  ] as const) {
    expect(
      screen.getByRole('link', { name: new RegExp(name) }),
    ).toHaveAttribute('href', `/places/${place}`);
  }
});

test('is unfolded when a place is shown, and marks where the player is', () => {
  render(
    <MemoryRouter initialEntries={['/places/work']}>
      <Sidebar
        id="panel"
        balanceCents={1250}
        calories={50}
        body={getBody(0)}
        brain={30}
        dreamGauge={20}
        dreams={2}
        isSleeping={false}
        location="restaurant"
        isOpen
        onClose={vi.fn()}
        onRestart={vi.fn()}
      />
    </MemoryRouter>,
  );
  expect(screen.getByRole('button', { name: /Places/ })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  expect(screen.getByRole('link', { name: /Restaurant/ })).toHaveTextContent(
    'you are here',
  );
  expect(screen.getByRole('link', { name: /Work/ })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('restarts the game and closes when Restart Game is clicked', async () => {
  const user = userEvent.setup();
  const { onClose, onRestart } = renderPanel(true);
  await user.click(screen.getByRole('button', { name: 'Restart Game' }));
  expect(onRestart).toHaveBeenCalledOnce();
  expect(onClose).toHaveBeenCalled();
});
