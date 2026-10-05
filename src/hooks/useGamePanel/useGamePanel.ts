import { useGameContext } from '@context/GameContext';
import type { ActionId } from '@game/actions';
import { JOBS } from '@game/jobs';
import {
  formatClock,
  formatDuration,
  HOURS_PER_DAY,
  weekdayLabel,
} from '@game/time';

// What the home page shows: the job, the way to the other place, and the
// actions of the place the player is at.
export const useGamePanel = () => {
  const {
    location,
    job,
    currentShift,
    nextShift,
    elapsedHours,
    origin,
    actions,
    perform,
    goTo,
  } = useGameContext();

  const currentDay = Math.floor(elapsedHours / HOURS_PER_DAY);

  const shift = (() => {
    if (currentShift) {
      return `${currentShift.title} until ${formatClock(currentShift.end)}`;
    }
    if (!nextShift) return 'No shift to come';
    const { day, shift: next } = nextShift;
    const when = day === currentDay ? 'today' : weekdayLabel(origin, day);
    return `Next shift ${when}, ${formatClock(next.start)} – ${formatClock(next.end)}`;
  })();

  const jobDefinition = job ? JOBS[job.id] : undefined;

  return {
    location,
    job: jobDefinition && {
      title: jobDefinition.title,
      pay: `${jobDefinition.hourlyCoins} coins / hour`,
      shift,
    },
    // a job is what takes the player to work
    travel: (() => {
      if (location === 'work') {
        return { label: 'Go home', place: 'home' } as const;
      }
      return job
        ? ({ label: 'Go to work', place: 'work' } as const)
        : undefined;
    })(),
    actions: actions.map(({ action, blocker }) => ({
      id: action.id,
      label: action.label,
      kind: action.kind,
      duration: formatDuration(action.hours),
      blocker,
    })),
    perform: (id: string) => {
      perform(id as ActionId);
    },
    goTo,
  };
};
