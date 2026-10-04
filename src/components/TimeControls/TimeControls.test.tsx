import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';

import { TimeControls } from './TimeControls';

const setup = (props: Partial<Parameters<typeof TimeControls>[0]> = {}) => {
  const onFaster = vi.fn();
  const onSlower = vi.fn();
  render(
    <TimeControls
      speed={2}
      canSpeedUp
      canSlowDown
      onFaster={onFaster}
      onSlower={onSlower}
      {...props}
    />,
  );
  return { onFaster, onSlower };
};

test('shows the current speed', () => {
  setup({ speed: 4 });
  expect(screen.getByLabelText('Time speed')).toHaveTextContent('×4');
});

test('the buttons ask for a faster or slower time', async () => {
  const { onFaster, onSlower } = setup();

  await userEvent.click(screen.getByRole('button', { name: 'Speed up time' }));
  await userEvent.click(screen.getByRole('button', { name: 'Slow down time' }));

  expect(onFaster).toHaveBeenCalledOnce();
  expect(onSlower).toHaveBeenCalledOnce();
});

test('disables a button once its limit is reached', () => {
  setup({ canSpeedUp: false, canSlowDown: false });
  expect(screen.getByRole('button', { name: 'Speed up time' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Slow down time' })).toBeDisabled();
});
