// Gold coins are whole numbers; they are only turned into text for display.
const WHOLE = new Intl.NumberFormat('en-US');

// From 10,000 up: 12.5K, 2.35M, 1B...
const COMPACT = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

const COMPACT_THRESHOLD = 10_000;

export const formatCoins = (coins: number) =>
  Math.abs(coins) >= COMPACT_THRESHOLD
    ? COMPACT.format(coins)
    : WHOLE.format(coins);
