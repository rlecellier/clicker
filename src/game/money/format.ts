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

type FormatMoneyOptions = {
  // always show the cents, even for a whole number of dollars
  alwaysCents?: boolean;
};

export const formatMoney = (
  cents: number,
  { alwaysCents = false }: FormatMoneyOptions = {},
) => {
  const isWhole = cents % 100 === 0;
  return (isWhole && !alwaysCents ? WHOLE : WITH_CENTS).format(cents / 100);
};
