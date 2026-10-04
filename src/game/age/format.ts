const DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

// 1 February 2009
export const formatBirthDate = (date: Date) => DATE.format(date);

// 2 y 14 d, the zero parts are left out.
export const formatLifeTime = ({
  years,
  days,
}: {
  years: number;
  days: number;
}) => {
  const parts = [years > 0 && `${years} y`, `${days} d`].filter(Boolean);
  return parts.join(' ');
};
