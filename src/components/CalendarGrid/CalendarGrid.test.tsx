import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';

import { CalendarGrid } from './CalendarGrid';

test('shows one column per day, with its weekday and its date', () => {
  render(<CalendarGrid days={[0, 1, 2]} currentDay={0} dayRatio={0} />);
  expect(screen.getAllByRole('list')).toHaveLength(3);
  expect(screen.getByRole('list', { name: 'Mon 1' })).toBeInTheDocument();
  expect(screen.getByRole('list', { name: 'Wed 3' })).toBeInTheDocument();
});

test('shows the work events on weekdays only, and the meals every day', () => {
  render(<CalendarGrid days={[4, 5]} currentDay={4} dayRatio={0} />);
  const friday = within(screen.getByRole('list', { name: 'Fri 5' }));
  const saturday = within(screen.getByRole('list', { name: 'Sat 6' }));
  expect(friday.getAllByText('Work')).toHaveLength(2);
  expect(saturday.queryByText('Work')).not.toBeInTheDocument();
  expect(saturday.getByText('Lunch')).toBeInTheDocument();
});

test('places an event at its hours', () => {
  render(<CalendarGrid days={[0]} currentDay={0} dayRatio={0} />);
  const [morning] = screen.getAllByTitle(/^Work/);
  expect(morning).toHaveAttribute('title', 'Work 08:00–12:00');
  expect(morning).toHaveStyle({ top: `${(8 / 24) * 100}%` });
});

test('puts the cursor on the current day only', () => {
  const { container } = render(
    <CalendarGrid days={[0, 1]} currentDay={1} dayRatio={0.5} />,
  );
  const today = container.querySelector<HTMLElement>('[data-current]');
  expect(today).toHaveTextContent('2');
  const cursors = container.querySelectorAll<HTMLElement>('li[aria-hidden]');
  expect(cursors).toHaveLength(1);
  expect(cursors[0]).toHaveStyle({ top: '50%' });
});
