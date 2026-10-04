import { useEffect, useRef } from 'react';

import type { GameState } from '@game/gameState';
import { writeSave } from '@game/save';

export const AUTO_SAVE_INTERVAL_MS = 5000;

// Saves the game in the browser every few seconds, and when the page is
// hidden or closed. The state changes on every frame, so it is only written
// from time to time.
export const useAutoSave = (state: GameState, isEnabled: boolean) => {
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!isEnabled) return;

    const save = () => {
      writeSave(localStorage, stateRef.current);
    };
    const saveWhenHidden = () => {
      if (document.visibilityState === 'hidden') save();
    };

    const interval = setInterval(save, AUTO_SAVE_INTERVAL_MS);
    document.addEventListener('visibilitychange', saveWhenHidden);
    window.addEventListener('pagehide', save);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', saveWhenHidden);
      window.removeEventListener('pagehide', save);
      save();
    };
  }, [isEnabled]);
};
