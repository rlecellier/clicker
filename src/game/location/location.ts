import type { Location } from './types';

export const LOCATIONS: readonly Location[] = ['home', 'work'];

export const isLocation = (value: string | undefined): value is Location =>
  (LOCATIONS as readonly (string | undefined)[]).includes(value);
