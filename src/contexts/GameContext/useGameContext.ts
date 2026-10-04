import { use } from 'react';

import { GameContext } from './GameContext';

export const useGameContext = () => {
  const value = use(GameContext);
  if (!value) throw new Error('useGameContext needs a <GameProvider>');
  return value;
};
