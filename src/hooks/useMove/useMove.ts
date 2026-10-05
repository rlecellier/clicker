import { useState } from 'react';

import { PLACES } from '@component/PlaceInfo';
import { useGameContext } from '@context/GameContext';
import {
  defaultDestination,
  destinationsFrom,
  isLocation,
  type Location,
} from '@game/location';

// Moving to another place: the player picks where, and the choice starts on
// the usual destination of the place they are at. Nothing to offer when there
// is nowhere to go (at home without a job).
export const useMove = () => {
  const { activity, goTo, job, location } = useGameContext();
  const [picked, setPicked] = useState<Location>();

  const places = destinationsFrom(location, job !== undefined);
  // a choice that is no longer possible gives way to the default
  const destination =
    picked && places.includes(picked)
      ? picked
      : defaultDestination(location, job !== undefined);
  if (!destination) return;

  return {
    destinations: places.map((id) => ({ id, label: PLACES[id].label })),
    destination,
    isBusy: activity !== undefined,
    pick: (id: string) => {
      if (isLocation(id)) setPicked(id);
    },
    go: () => {
      goTo(destination);
      setPicked(undefined);
    },
  };
};
