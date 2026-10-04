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
