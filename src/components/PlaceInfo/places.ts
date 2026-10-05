import { Briefcase, House, type LucideIcon } from 'lucide-react';

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
    purpose: 'Look for a job, eat, read and sleep.',
  },
  work: {
    label: 'Work',
    Icon: Briefcase,
    purpose: 'Work during your shifts to earn gold coins.',
  },
} satisfies Record<Location, PlaceInfo>;
