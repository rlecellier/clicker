import { faker } from '@faker-js/faker';
import { createFactory } from 'factory-kit';

import { INITIAL_GAME_STATE, type GameState } from '@game/gameState';
import { hireAt } from '@game/jobs';

export const gameStateFactory = createFactory<GameState>()
  .define({
    ...INITIAL_GAME_STATE,
    coins: () => faker.number.int({ min: 1, max: 10_000 }),
  })
  .trait('broke', { coins: 0 })
  // a clothes seller since the start of the game, at home on Monday 07:00
  .trait('working', { job: hireAt('clothes-seller', 0) });
