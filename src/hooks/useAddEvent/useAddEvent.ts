import { useState } from 'react';

import { useGameContext } from '@context/GameContext';
import {
  eventOf,
  fitsInPlan,
  problemWith,
  type EventDraft,
  type EventDraftText,
} from '@game/calendar';
import {
  formatClock,
  HOURS_PER_DAY,
  DAYS_PER_WEEK,
  parseClock,
} from '@game/time';

const INITIAL_DRAFT: EventDraft = {
  activity: 'read',
  start: 20,
  end: 22,
  repeat: 'daily',
  mode: 'auto',
};

// The form that adds an event to the plan. A single event is planned on the
// day shown in the calendar, or today when that day is gone.
export const useAddEvent = (shownDay: number) => {
  const { week, weekHour, schedule, planEvent } = useGameContext();
  const today = week * DAYS_PER_WEEK + Math.floor(weekHour / HOURS_PER_DAY);
  const day = Math.max(shownDay, today);

  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(INITIAL_DRAFT);

  const problem =
    problemWith(draft) ??
    (fitsInPlan(schedule.plan, { ...eventOf(draft, day), id: 'draft' })
      ? undefined
      : 'This overlaps another event of your plan.');

  return {
    isOpen,
    day,
    draft: {
      ...draft,
      start: formatClock(draft.start),
      end: formatClock(draft.end),
    },
    problem,
    open: () => {
      setIsOpen(true);
    },
    close: () => {
      setIsOpen(false);
    },
    // the times come from the form as "HH:MM", the others as they are
    change: (patch: Partial<EventDraftText>) => {
      setDraft((current) => ({
        ...current,
        ...patch,
        start: parseClock(patch.start ?? '') ?? current.start,
        end: parseClock(patch.end ?? '') ?? current.end,
      }));
    },
    submit: () => {
      if (problem) return;
      planEvent(eventOf(draft, day));
      setIsOpen(false);
    },
  };
};
