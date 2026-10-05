import { FRIDGE_MAX } from './constants';
import type { Fridge } from './types';

// A new game starts with a full fridge.
export const INITIAL_FRIDGE: Fridge = { fridge: FRIDGE_MAX };
