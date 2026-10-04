const DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

// 4 October 2008, from 2008-10-04
export const formatBirthDate = (birthDate: string) =>
  DATE.format(new Date(birthDate));

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
