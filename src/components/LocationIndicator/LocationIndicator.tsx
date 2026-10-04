import { Briefcase, House, Utensils } from 'lucide-react';

import type { Location } from '@game/location';

import styles from './LocationIndicator.module.css';

type LocationIndicatorProps = {
  location: Location;
};

const PLACES = {
  home: { label: 'Home', Icon: House },
  office: { label: 'Office', Icon: Briefcase },
  restaurant: { label: 'Restaurant', Icon: Utensils },
} satisfies Record<Location, { label: string; Icon: typeof House }>;

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
