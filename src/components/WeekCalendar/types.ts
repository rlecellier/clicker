export type CalendarEvent = {
  id: string;
  title: string;
  // days of the week the event happens on, 0 = Monday
  days: number[];
  // hours since the start of the day, between 0 and 24
  start: number;
  end: number;
};
