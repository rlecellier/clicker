import { useCallback, useState } from 'react';

import { birthDateOf } from '@game/age';
import { newGameState, type GameState } from '@game/gameState';
import { clearSave, readSave } from '@game/save';
import { gameStartOf } from '@game/time';

// The saved game is read once, when the page opens. Without one, there is no
// game until the player starts it, at the date and time of that moment.
// Restarting forgets the saved game and goes back to the start screens.
export const useGameStart = () => {
  const [game, setGame] = useState<GameState | undefined>(() =>
    readSave(localStorage),
  );
  const start = useCallback(() => {
    const now = new Date();
    setGame(newGameState({ ...gameStartOf(now), birthDate: birthDateOf(now) }));
  }, []);

  const restart = useCallback(() => {
    clearSave(localStorage);
    setGame(undefined);
  }, []);

  return { game, start, restart };
};
