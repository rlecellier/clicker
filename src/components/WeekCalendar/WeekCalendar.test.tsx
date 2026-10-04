import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { WeekCalendar } from './WeekCalendar';

test('shows the seven days of the week, Monday first', () => {
  render(<WeekCalendar weekHour={0} />);
  expect(screen.getByText('Mon')).toBeInTheDocument();
  expect(screen.getByText('Sun')).toBeInTheDocument();
  expect(screen.getAllByText(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/)).toHaveLength(
    7,
  );
});

test('announces the current day and hour', () => {
  render(<WeekCalendar weekHour={24 * 2 + 13.5} />);
  expect(screen.getByRole('img', { name: 'Wed, 13:00' })).toBeInTheDocument();
});

test('shows the work event from 8h to 12h and 13h to 18h on weekdays', () => {
  const { container } = render(<WeekCalendar weekHour={0} />);
  const events = container.querySelectorAll<HTMLElement>('[title^="Work"]');
  expect(events).toHaveLength(10);
  expect(events[0]).toHaveAttribute('title', 'Work 8:00–12:00');
  expect(events[0]?.style.top).toBe(`${(8 / 24) * 100}%`);
  expect(events[1]).toHaveAttribute('title', 'Work 13:00–18:00');
});
