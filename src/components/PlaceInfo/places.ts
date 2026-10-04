import { Briefcase, House, Utensils, type LucideIcon } from 'lucide-react';

import type { Location } from '@game/location';

type PlaceInfo = {
  label: string;
  Icon: LucideIcon;
  // what the player does there
  purpose: string;
};

export const PLACES = {
  home: {
    label: 'Home',
    Icon: House,
    purpose: 'Sleep, read and rest between two events.',
  },
  work: {
    label: 'Work',
    Icon: Briefcase,
    purpose: 'Work on weekdays to earn your salary.',
  },
  restaurant: {
    label: 'Restaurant',
    Icon: Utensils,
    purpose: 'Eat breakfast, lunch and dinner to fill the calories gauge.',
  },
} satisfies Record<Location, PlaceInfo>;
