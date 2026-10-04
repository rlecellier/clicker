export type Nutrition = {
  // gauge between 0 and 100, to keep between 20 and 80
  calories: number;
  // calories that went over 80 and were turned into fat
  fat: number;
  // game hour at which the cake being enjoyed ends, 0 when there is none
  cakeUntil: number;
};

// where the calories gauge stands compared to the 20%–80% range to keep
export type CaloriesLevel = 'low' | 'balanced' | 'high';
