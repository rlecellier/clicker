import { useEffect } from 'react';

import type { GameState } from '@game/gameState';
import { writeSave } from '@game/save';

// Saves the game in the browser each time it changes, but not while an action
// runs: the game changes on every frame then, and the action will be saved once
// it is over.
export const useAutoSave = (state: GameState, isEnabled: boolean) => {
  useEffect(() => {
    if (isEnabled && !state.activity) writeSave(localStorage, state);
  }, [state, isEnabled]);
};
