import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';

import { CaloriesPanel } from './CaloriesPanel';

const renderPanel = (isOpen: boolean) => {
  const onClose = vi.fn();
  render(
    <CaloriesPanel
      id="panel"
      calories={50}
      fat={1.5}
      isOpen={isOpen}
      onClose={onClose}
    />,
  );
  return onClose;
};

test('contains the calories gauge and the fat', () => {
  renderPanel(false);
  expect(screen.getByRole('meter', { name: 'Calories' })).toBeInTheDocument();
  expect(screen.getByText('Fat 1.5')).toBeInTheDocument();
});

test('is marked as open only when it is open', () => {
  const { container } = render(
    <CaloriesPanel id="panel" calories={50} fat={0} isOpen onClose={vi.fn()} />,
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
