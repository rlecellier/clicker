import { DAYS_PER_WEEK, dateOfDay, dayOfMonth, weekdayLabel } from '@game/time';

export type CalendarView = 'day' | 'week';

const month = new Intl.DateTimeFormat('en', {
  month: 'short',
  timeZone: 'UTC',
});

// The days of the game on screen: the selected day, or its whole week
// (Monday to Sunday).
export const visibleDays = (selectedDay: number, view: CalendarView) => {
  if (view === 'day') return [selectedDay];
  const monday = selectedDay - (selectedDay % DAYS_PER_WEEK);
  return Array.from({ length: DAYS_PER_WEEK }, (_, index) => monday + index);
};

const monthAndYear = (absoluteDay: number) => {
  const date = dateOfDay(absoluteDay);
  return { month: month.format(date), year: date.getUTCFullYear() };
};

const part = (absoluteDay: number, hasMonth: boolean, hasYear: boolean) => {
  const { month: name, year } = monthAndYear(absoluteDay);
  return [dayOfMonth(absoluteDay), hasMonth && name, hasYear && year]
    .filter(Boolean)
    .join(' ');
};

// "Wed 3 Feb 2027" for a day, "1 – 7 Feb 2027" or "25 Feb – 3 Mar 2027" for
// a week.
export const rangeLabel = (days: number[]) => {
  const first = days[0] ?? 0;
  const last = days.at(-1) ?? first;
  if (first === last) {
    return `${weekdayLabel(first)} ${part(first, true, true)}`;
  }
  const start = monthAndYear(first);
  const end = monthAndYear(last);
  const hasYear = start.year !== end.year;
  const hasMonth = hasYear || start.month !== end.month;
  return `${part(first, hasMonth, hasYear)} – ${part(last, true, true)}`;
};
