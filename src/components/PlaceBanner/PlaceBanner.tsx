import { MapPin, MapPinOff } from 'lucide-react';

import { PLACES } from '@component/PlaceInfo';
import type { Location } from '@game/location';

import styles from './PlaceBanner.module.css';

type PlaceBannerProps = {
  place: Location;
  // where the player is right now
  location: Location;
};

// Tells whether the player is at this place, in the same height for every place.
export const PlaceBanner = ({ place, location }: PlaceBannerProps) => {
  const { label, Icon } = PLACES[place];
  const isHere = place === location;

  return (
    <section className={styles.root} data-here={isHere || undefined}>
      <Icon aria-hidden size={24} className={styles.icon} />
      <h2 className={styles.title}>{label}</h2>
      <p className={styles.status} role="status">
        {isHere ? (
          <MapPin aria-hidden size={14} />
        ) : (
          <MapPinOff aria-hidden size={14} />
        )}
        {isHere ? 'You are here' : 'You are not here'}
      </p>
    </section>
  );
};
