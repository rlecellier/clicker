// Money is stored in integer cents; it is only turned into text for display.
const WHOLE = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const WITH_CENTS = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
// From $1,000 up: $1.5K, $2.35M, $1B...
const COMPACT = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
const COMPACT_THRESHOLD_CENTS = 100_000;

type FormatMoneyOptions = {
  // always show the cents, even for a whole number of dollars
  alwaysCents?: boolean;
};

export const formatMoney = (
  cents: number,
  { alwaysCents = false }: FormatMoneyOptions = {},
) => {
  if (Math.abs(cents) >= COMPACT_THRESHOLD_CENTS) {
    return COMPACT.format(cents / 100);
  }
  const isWhole = cents % 100 === 0;
  return (isWhole && !alwaysCents ? WHOLE : WITH_CENTS).format(cents / 100);
};
