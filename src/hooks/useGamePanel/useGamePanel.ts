import { useGameContext } from '@context/GameContext';
import { usePlaceActions } from '@hook/usePlaceActions';
import { JOBS } from '@game/jobs';
import { formatClock, HOURS_PER_DAY, weekdayLabel } from '@game/time';

// What the home page shows: the job and the actions of the place the player
// is at.
export const useGamePanel = () => {
  const {
    location,
    job,
    activity,
    currentShift,
    nextShift,
    elapsedHours,
    origin,
  } = useGameContext();
  const { sections, perform, pick } = usePlaceActions(location);

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
    activity,
    job: jobDefinition && {
      title: jobDefinition.title,
      pay: `${jobDefinition.hourlyCoins} coins / hour`,
      shift,
    },
    sections,
    perform,
    pick,
  };
};
