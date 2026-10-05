import { PlaceList } from '@component/PlaceList';
import { useGameContext } from '@context/GameContext';

import styles from './PlacesPage.module.css';

export const PlacesPage = () => {
  const { location } = useGameContext();

  return (
    <section>
      <h2 className={styles.title}>Places</h2>
      <PlaceList location={location} />
    </section>
  );
};
