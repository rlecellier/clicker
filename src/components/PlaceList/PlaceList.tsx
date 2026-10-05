import { MapPin } from 'lucide-react';
import { Link } from 'react-router';

import { PLACES } from '@component/PlaceInfo';
import { LOCATIONS, type Location } from '@game/location';

import styles from './PlaceList.module.css';

type PlaceListProps = {
  // where the player is right now, marked in the list
  location: Location;
};

// One button per place, each leading to the page of the place.
export const PlaceList = ({ location }: PlaceListProps) => (
  <ul className={styles.list}>
    {LOCATIONS.map((place) => {
      const { label, Icon, purpose } = PLACES[place];
      return (
        <li key={place}>
          <Link
            to={`/places/${place}`}
            className={styles.place}
            data-here={place === location || undefined}
          >
            <Icon aria-hidden size={24} className={styles.icon} />
            <span className={styles.text}>
              <span className={styles.label}>{label}</span>
              <span className={styles.purpose}>{purpose}</span>
            </span>
            {place === location && (
              <span className={styles.here}>
                <MapPin aria-hidden size={14} />
                You are here
              </span>
            )}
          </Link>
        </li>
      );
    })}
  </ul>
);
