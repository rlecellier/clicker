import { useState } from 'react';

import { PLACES } from '@component/PlaceInfo';
import { useGameContext } from '@context/GameContext';
import type { GameContextValue } from '@context/GameContext/types';
import {
  ACTION_CATEGORIES,
  type ActionCategory,
  type ActionId,
} from '@game/actions';
import type { EventKind } from '@game/history';
import type { Location } from '@game/location';
import { formatDuration } from '@game/time';

export type Row = {
  key: string;
  // the name of the group, none for an action alone
  name?: string;
  // the id of the option chosen in a group
  selected?: string;
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

const TITLES: Record<ActionCategory, string | undefined> = {
  place: undefined,
  self: 'You',
  online: 'Phone',
};

// The actions of a group (sleep 2, 4, 6, 8 h) share one row.
const rowsOf = (
  actions: ReturnType<GameContextValue['actionsAt']>,
  picks: Record<string, string>,
): Row[] => {
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
        selected: picks[action.group?.name ?? ''],
        kind: action.kind,
        options: [option],
      });
    }
  }
  return rows;
};

// The actions of a place, split by where they come from (the place, the
// player, their phone) and one row each: done right away when the player is
// there, queued for when they get there otherwise. A category with no action
// is left out.
export const usePlaceActions = (place: Location) => {
  const { actionsAt, perform } = useGameContext();
  const offered = actionsAt(place);
  // the option chosen in each group, by the group's name
  const [picks, setPicks] = useState<Record<string, string>>({});

  return {
    sections: ACTION_CATEGORIES.map((category) => ({
      category,
      title: TITLES[category] ?? `At ${PLACES[place].label.toLowerCase()}`,
      rows: rowsOf(
        offered.filter(({ action }) => action.category === category),
        picks,
      ),
    })).filter(({ rows }) => rows.length > 0),
    pick: (name: string, id: string) => {
      setPicks((current) => ({ ...current, [name]: id }));
    },
    perform: (id: string) => {
      perform(id as ActionId);
    },
  };
};
