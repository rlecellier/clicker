import { useGameContext } from '@context/GameContext';
import { eventAt, nextEventAfter, type EventKind } from '@game/calendar';
import {
  DAYS_PER_WEEK,
  formatClock,
  formatDuration,
  HOURS_PER_DAY,
} from '@game/time';

export type ScheduleTask = {
  title: string;
  kind: EventKind | 'free';
  detail: string;
};

// The day timeline and the two tasks (current, next) shown on the home page.
export const useSchedule = () => {
  const { elapsedHours, weekHour, week, schedule } = useGameContext();
  const hour = weekHour % HOURS_PER_DAY;
  // absolute day with its fraction, e.g. 3.5 is noon on the fourth day
  const dayPosition = week * DAYS_PER_WEEK + weekHour / HOURS_PER_DAY;

  const running = eventAt(schedule, elapsedHours);
  const current: ScheduleTask = running
    ? {
        title: running.title,
        kind: running.kind,
        detail: `${formatClock(running.start)} – ${formatClock(running.end)} · ends in ${formatDuration(running.end - hour)}`,
      }
    : { title: 'Free time', kind: 'free', detail: 'Nothing planned' };

  const upcoming = nextEventAfter(schedule, elapsedHours);
  const next: ScheduleTask = upcoming
    ? {
        title: upcoming.event.title,
        kind: upcoming.event.kind,
        detail: `${formatClock(upcoming.event.start)} – ${formatClock(upcoming.event.end)} · in ${formatDuration(upcoming.startsIn)}`,
      }
    : {
        title: 'Nothing planned',
        kind: 'free',
        detail: 'The calendar is empty',
      };

  return { weekHour, dayPosition, schedule, current, next };
};
