export type Sleep = {
  // gauge between 0 and 100: fills while awake, empties during sleep
  brain: number;
  // gauge below 100: what the sleep could not empty from the brain fills it,
  // and a dream is made each time it is full
  dreamGauge: number;
  // dreams made so far
  dreams: number;
};
