export type GameState = {
  money: number;
};

export const INITIAL_GAME_STATE: GameState = { money: 0 };

export type Nutrition = {
  // gauge between 0 and 100, to keep between 20 and 80
  calories: number;
  // calories that went over 80 and were turned into fat
  fat: number;
  // game hour at which the cake being enjoyed ends, 0 when there is none
  cakeUntil: number;
};
