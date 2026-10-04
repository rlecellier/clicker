import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';

import { GaugesPanel } from './GaugesPanel';

const renderPanel = (isOpen: boolean) => {
  const onClose = vi.fn();
  render(
    <GaugesPanel
      id="panel"
      calories={50}
      fat={1.5}
      brain={30}
      isSleeping={false}
      isOpen={isOpen}
      onClose={onClose}
    />,
  );
  return onClose;
};

test('contains the calories and brain gauges and the fat', () => {
  renderPanel(false);
  expect(screen.getByRole('meter', { name: 'Calories' })).toBeInTheDocument();
  expect(screen.getByRole('meter', { name: 'Brain' })).toBeInTheDocument();
  expect(screen.getByText('Fat 1.5')).toBeInTheDocument();
});

test('is marked as open only when it is open', () => {
  const { container } = render(
    <GaugesPanel
      id="panel"
      calories={50}
      fat={0}
      brain={30}
      isSleeping={false}
      isOpen
      onClose={vi.fn()}
    />,
  );
  expect(container.querySelector('#panel')).toHaveAttribute('data-open');
});

test('closes when the backdrop is clicked', async () => {
  const user = userEvent.setup();
  const onClose = renderPanel(true);
  // the backdrop is decorative, so it has no role: reach it from the panel
  const backdrop = screen.getByRole('complementary').previousElementSibling;
  await user.click(backdrop as Element);
  expect(onClose).toHaveBeenCalledOnce();
});

test('closes on Escape when it is open', async () => {
  const user = userEvent.setup();
  const onClose = renderPanel(true);
  await user.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalledOnce();
});

test('ignores Escape when it is closed', async () => {
  const user = userEvent.setup();
  const onClose = renderPanel(false);
  await user.keyboard('{Escape}');
  expect(onClose).not.toHaveBeenCalled();
});
