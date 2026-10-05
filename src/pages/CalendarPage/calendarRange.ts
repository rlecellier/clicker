import {
  DAYS_PER_WEEK,
  dayOfMonth,
  monthLabel,
  weekdayLabel,
  yearOf,
} from '@game/time';

export type CalendarView = 'day' | 'week';

// The days of the game on screen: the selected day, or its whole week
// (Monday to Sunday).
export const visibleDays = (selectedDay: number, view: CalendarView) => {
  if (view === 'day') return [selectedDay];
  const monday = selectedDay - (selectedDay % DAYS_PER_WEEK);
  return Array.from({ length: DAYS_PER_WEEK }, (_, index) => monday + index);
};

// "Wed 3 Feb 2027" for a day, "1 – 7 Feb 2027" for a week: a week is a month
// of the artificial calendar (ADR 0006), so it never spans two of them.
export const rangeLabel = (origin: number, days: number[]) => {
  const first = days[0] ?? 0;
  const last = days.at(-1) ?? first;
  const month = `${monthLabel(origin, first)} ${yearOf(origin, first)}`;
  return first === last
    ? `${weekdayLabel(origin, first)} ${dayOfMonth(origin, first)} ${month}`
    : `${dayOfMonth(origin, first)} – ${dayOfMonth(origin, last)} ${month}`;
};
