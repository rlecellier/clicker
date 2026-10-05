import { PLACES } from '@component/PlaceInfo';
import { useGameContext } from '@context/GameContext';

// The queued actions as the list shows them, and the way to cancel one.
export const useQueue = () => {
  const { queue, unqueue } = useGameContext();

  return {
    items: queue.map(({ id, label, place }) => ({
      key: id,
      label,
      place: place === 'anywhere' ? 'anywhere' : PLACES[place].label,
    })),
    remove: unqueue,
  };
};
