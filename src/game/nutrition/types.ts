export type Nutrition = {
  // gauge between 0 and 100, to keep between 20 and 80
  calories: number;
  // calories that went over 80 and were turned into fat
  fat: number;
};

// where the calories gauge stands compared to the 20%–80% range to keep
export type CaloriesLevel = 'low' | 'balanced' | 'high';

// finer reading of the gauge, used for colors and messages: green between 40%
// and 60%, yellow between 20%–40% and 60%–80%, red outside the 20%–80% range
export type CaloriesStatus =
  'starving' | 'running-low' | 'good' | 'running-high' | 'overflowing';
