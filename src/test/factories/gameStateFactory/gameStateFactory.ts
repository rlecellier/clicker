import { faker } from '@faker-js/faker';
import { createFactory } from 'factory-kit';

import { INITIAL_GAME_STATE, type GameState } from '@game/gameState';

export const gameStateFactory = createFactory<GameState>()
  .define({
    ...INITIAL_GAME_STATE,
    balanceCents: () => faker.number.int({ min: 100, max: 1_000_000 }),
  })
  .trait('broke', { balanceCents: 0 });
