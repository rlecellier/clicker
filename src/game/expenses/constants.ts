// Everything the player pays, in integer cents.
export const WEEKLY_RENT_CENTS = 8000;

export const MEAL_IDS = ['breakfast', 'lunch', 'dinner'] as const;

// Paid each time the meal of the calendar starts.
export const MEAL_PRICES_CENTS = {
  breakfast: 250,
  lunch: 700,
  dinner: 900,
} as const satisfies Record<(typeof MEAL_IDS)[number], number>;
