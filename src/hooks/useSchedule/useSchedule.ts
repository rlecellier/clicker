import { useGameContext } from '@context/GameContext';
import { eventAt, nextEventAfter, type CalendarEvent } from '@game/calendar';
import { DAYS_PER_WEEK, HOURS_PER_DAY } from '@game/time';

import { formatClock, formatDuration } from './format';

export type ScheduleTask = {
  title: string;
  kind: CalendarEvent['kind'] | 'free';
  detail: string;
};

// The day timeline and the two tasks (current, next) shown on the home page.
export const useSchedule = () => {
  const { week, weekHour } = useGameContext();
  const hour = weekHour % HOURS_PER_DAY;
  // absolute day with its fraction, e.g. 3.5 is noon on the fourth day
  const dayPosition = week * DAYS_PER_WEEK + weekHour / HOURS_PER_DAY;

  const running = eventAt(weekHour);
  const current: ScheduleTask = running
    ? {
        title: running.title,
        kind: running.kind,
        detail: `${formatClock(running.start)} – ${formatClock(running.end)} · ends in ${formatDuration(running.end - hour)}`,
      }
    : { title: 'Free time', kind: 'free', detail: 'Nothing planned' };

  const { event, startsIn } = nextEventAfter(weekHour);
  const next: ScheduleTask = {
    title: event.title,
    kind: event.kind,
    detail: `${formatClock(event.start)} – ${formatClock(event.end)} · in ${formatDuration(startsIn)}`,
  };

  return { weekHour, dayPosition, current, next };
};
