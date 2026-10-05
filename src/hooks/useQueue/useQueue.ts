import { PLACES } from '@component/PlaceInfo';
import { useGameContext } from '@context/GameContext';

// The queued actions as the list shows them, and the way to cancel one.
export const useQueue = () => {
  const { queue, unqueue } = useGameContext();

  return {
    items: queue.map(({ id, label, category, place }) => ({
      key: id,
      label,
      where: {
        place: `at ${place ? PLACES[place].label : ''}`,
        self: 'anywhere',
        online: 'on your phone',
      }[category],
    })),
    remove: unqueue,
  };
};
