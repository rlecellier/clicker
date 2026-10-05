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

const part = (
  origin: number,
  absoluteDay: number,
  hasMonth: boolean,
  hasYear: boolean,
) =>
  [
    dayOfMonth(origin, absoluteDay),
    hasMonth && monthLabel(origin, absoluteDay),
    hasYear && yearOf(origin, absoluteDay),
  ]
    .filter(Boolean)
    .join(' ');

// "Wed 3 Feb 2027" for a day, "1 – 7 Feb 2027" or "25 Feb – 3 Mar 2027" for
// a week.
export const rangeLabel = (origin: number, days: number[]) => {
  const first = days[0] ?? 0;
  const last = days.at(-1) ?? first;
  if (first === last) {
    return `${weekdayLabel(origin, first)} ${part(origin, first, true, true)}`;
  }
  const hasYear = yearOf(origin, first) !== yearOf(origin, last);
  const hasMonth =
    hasYear || monthLabel(origin, first) !== monthLabel(origin, last);
  return `${part(origin, first, hasMonth, hasYear)} – ${part(origin, last, true, true)}`;
};
