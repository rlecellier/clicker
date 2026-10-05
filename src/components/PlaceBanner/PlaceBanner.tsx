import { MapPin, MapPinOff } from 'lucide-react';

import { PLACES } from '@component/PlaceInfo';
import type { Location } from '@game/location';

import styles from './PlaceBanner.module.css';

type PlaceBannerProps = {
  place: Location;
  // where the player is right now
  location: Location;
};

// Tells whether the player is at this place, and what they can do there.
export const PlaceBanner = ({ place, location }: PlaceBannerProps) => {
  const { label, Icon, purpose } = PLACES[place];
  const isHere = place === location;

  return (
    <section className={styles.root} data-here={isHere || undefined}>
      <Icon aria-hidden className={styles.icon} size={40} />
      <div className={styles.text}>
        <p className={styles.status} role="status">
          {isHere ? (
            <MapPin aria-hidden size={16} />
          ) : (
            <MapPinOff aria-hidden size={16} />
          )}
          {isHere ? 'You are here' : 'You are not here'}
        </p>
        <h2 className={styles.title}>{label}</h2>
        <p className={styles.detail}>
          {isHere ? (
            purpose
          ) : (
            <>
              {purpose} You are at <strong>{PLACES[location].label}</strong>{' '}
              right now.
            </>
          )}
        </p>
      </div>
    </section>
  );
};
