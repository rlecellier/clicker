import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';

import { WeekCalendar } from './WeekCalendar';

test('starts on the current day and shows the next seven days', () => {
  render(<WeekCalendar week={0} weekHour={24 * 2} />);
  const labels = screen
    .getAllByText(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/)
    .map((element) => element.textContent);
  expect(labels.slice(1, 8)).toEqual([
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
    'Mon',
    'Tue',
  ]);
});

test('shows the month and the day of the month of each day', () => {
  render(<WeekCalendar week={0} weekHour={0} />);
  // The game starts on Monday 1 February 2027.
  expect(screen.getByText('Feb')).toBeInTheDocument();
  expect(screen.getByText('1')).toBeInTheDocument();
  expect(screen.getByText('7')).toBeInTheDocument();
});

test('shows both months when the visible week spans two of them', () => {
  render(<WeekCalendar week={3} weekHour={24 * 3} />);
  // 25 February 2027 to 3 March 2027
  expect(screen.getByText('Feb – Mar')).toBeInTheDocument();
  expect(screen.getByText('28')).toBeInTheDocument();
  expect(screen.getByText('1')).toBeInTheDocument();
});

test('announces the current day and hour', () => {
  render(<WeekCalendar week={0} weekHour={24 * 2 + 13.5} />);
  expect(screen.getByRole('img', { name: 'Wed, 13:00' })).toBeInTheDocument();
});

test('shows the work events from 8h to 12h and 13h to 18h on weekdays', () => {
  const { container } = render(<WeekCalendar week={0} weekHour={0} />);
  const today = container.querySelector<HTMLElement>('[data-current]');
  const events = within(today as HTMLElement).getAllByTitle(/^Work/);
  expect(events.map((event) => event.title)).toEqual([
    'Work 8:00–12:00',
    'Work 13:00–18:00',
  ]);
  expect(events[0]?.style.top).toBe(`${(8 / 24) * 100}%`);
});

test('shows the meals every day, including the weekend', () => {
  // Saturday
  const { container } = render(<WeekCalendar week={0} weekHour={24 * 5} />);
  const today = container.querySelector<HTMLElement>('[data-current]');
  expect(within(today as HTMLElement).queryAllByTitle(/^Work/)).toHaveLength(0);
  expect(
    within(today as HTMLElement).getAllByTitle(/^(Breakfast|Lunch|Dinner)/),
  ).toHaveLength(3);
});
