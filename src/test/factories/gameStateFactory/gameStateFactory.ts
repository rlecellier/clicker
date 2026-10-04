import { faker } from '@faker-js/faker';
import { createFactory } from 'factory-kit';

import type { GameState } from '@game/gameState';

export const gameStateFactory = createFactory<GameState>()
  .define({
    money: () => faker.number.int({ min: 1, max: 10_000 }),
  })
  .trait('broke', { money: 0 });
