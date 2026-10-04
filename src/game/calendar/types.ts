export type CalendarEvent = {
  id: string;
  // 'work' events earn the monthly salary while they run, 'meal' events add
  // their calories while they run, 'sleep' events empty the brain gauge
  kind: 'work' | 'meal' | 'sleep';
  title: string;
  // days of the week the event happens on, 0 = Monday
  days: number[];
  // hours since the start of the day, between 0 and 24
  start: number;
  end: number;
  // calories (in % of the gauge) added over the whole meal
  calories?: number;
};
