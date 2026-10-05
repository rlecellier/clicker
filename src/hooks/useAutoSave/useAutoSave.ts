import { useEffect } from 'react';

import type { GameState } from '@game/gameState';
import { writeSave } from '@game/save';

// Saves the game in the browser each time it changes. The game only changes
// when the player acts, so there is nothing to write in between.
export const useAutoSave = (state: GameState, isEnabled: boolean) => {
  useEffect(() => {
    if (isEnabled) writeSave(localStorage, state);
  }, [state, isEnabled]);
};
