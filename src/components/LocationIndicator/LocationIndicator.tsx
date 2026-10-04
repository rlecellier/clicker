import { PLACES } from '@component/PlaceInfo';
import type { Location } from '@game/location';

import styles from './LocationIndicator.module.css';

type LocationIndicatorProps = {
  location: Location;
};

export const LocationIndicator = ({ location }: LocationIndicatorProps) => {
  const { label, Icon } = PLACES[location];

  return (
    <p className={styles.root} data-location={location}>
      <Icon aria-hidden size={18} />
      <span className={styles.caption}>You are at</span>
      <strong>{label}</strong>
    </p>
  );
};
