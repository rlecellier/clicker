import type { Location } from './types';

export const LOCATIONS: readonly Location[] = ['home', 'work'];

export const isLocation = (value: string | undefined): value is Location =>
  (LOCATIONS as readonly (string | undefined)[]).includes(value);

// The places the player can move to from where they are: any other place, but
// only the job takes them to work.
export const destinationsFrom = (
  location: Location,
  hasJob: boolean,
): Location[] =>
  LOCATIONS.filter(
    (place) => place !== location && (place !== 'work' || hasJob),
  );

// What the player most likely wants: leaving work for home, and home for work.
export const defaultDestination = (
  location: Location,
  hasJob: boolean,
): Location | undefined => {
  const destinations = destinationsFrom(location, hasJob);
  const usual: Location = location === 'work' ? 'home' : 'work';
  return destinations.includes(usual) ? usual : destinations[0];
};
