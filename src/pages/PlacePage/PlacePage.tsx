import { useParams } from 'react-router';

import { PlaceBanner } from '@component/PlaceBanner';
import { useGameContext } from '@context/GameContext';
import { isLocation } from '@game/location';

import styles from './PlacePage.module.css';

export const PlacePage = () => {
  const { place } = useParams();
  const { location } = useGameContext();

  if (!isLocation(place)) {
    // the route loader already answered 404: this only narrows the type
    return;
  }

  return (
    <div className={styles.root}>
      <PlaceBanner place={place} location={location} />
    </div>
  );
};
