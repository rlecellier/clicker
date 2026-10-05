import { useGameContext } from '@context/GameContext';
import type { EventKind } from '@game/history';
import type { ActionId } from '@game/actions';
import { JOBS } from '@game/jobs';
import {
  formatClock,
  formatDuration,
  HOURS_PER_DAY,
  weekdayLabel,
} from '@game/time';

type Row = {
  key: string;
  // the name of the group, none for an action alone
  name?: string;
  kind: EventKind;
  options: {
    id: string;
    // what the button says
    text: string;
    // what assistive technologies read
    label: string;
    duration: string;
    blocker?: string;
  }[];
};

// The actions of a group (sleep 2, 4, 6, 8 h) share one row.
const rowsOf = (
  actions: ReturnType<typeof useGameContext>['actions'],
): Row[] => {
  const rows: Row[] = [];
  for (const { action, blocker } of actions) {
    const option = {
      id: action.id,
      text: action.group?.option ?? action.label,
      label: action.label,
      duration: formatDuration(action.hours),
      blocker,
    };
    const row = action.group
      ? rows.find(({ name }) => name === action.group?.name)
      : undefined;
    if (row) row.options.push(option);
    else {
      rows.push({
        key: action.group?.name ?? action.id,
        name: action.group?.name,
        kind: action.kind,
        options: [option],
      });
    }
  }
  return rows;
};

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
    rows: rowsOf(actions),
    perform: (id: string) => {
      perform(id as ActionId);
    },
    goTo,
  };
};
