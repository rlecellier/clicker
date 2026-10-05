import { useGameContext } from '@context/GameContext';
import type { GameContextValue } from '@context/GameContext/types';
import type { ActionId } from '@game/actions';
import type { EventKind } from '@game/history';
import type { Location } from '@game/location';
import { formatDuration } from '@game/time';

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
    detail: string;
    blocker?: string;
  }[];
};

// The actions of a group (sleep 2, 4, 6, 8 h) share one row.
const rowsOf = (actions: ReturnType<GameContextValue['actionsAt']>): Row[] => {
  const rows: Row[] = [];
  for (const { action, blocker } of actions) {
    const option = {
      id: action.id,
      text: action.group?.option ?? action.label,
      label: action.label,
      detail: action.cost
        ? `${formatDuration(action.hours)} · ${action.cost} coins`
        : formatDuration(action.hours),
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

// The actions of a place, one row each: done right away when the player is
// there, queued for when they get there otherwise.
export const usePlaceActions = (place: Location) => {
  const { actionsAt, perform } = useGameContext();

  return {
    rows: rowsOf(actionsAt(place)),
    perform: (id: string) => {
      perform(id as ActionId);
    },
  };
};
