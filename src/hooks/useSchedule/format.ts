const pad = (value: number) => String(value).padStart(2, '0');

// 7.5 -> "07:30"
export const formatClock = (hour: number) => {
  const minutes = Math.round(hour * 60);
  return `${pad(Math.floor(minutes / 60) % 24)}:${pad(minutes % 60)}`;
};

// 2.5 -> "2h 30", 0.5 -> "30 min"
export const formatDuration = (hours: number) => {
  const minutes = Math.max(1, Math.round(hours * 60));
  const wholeHours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (wholeHours === 0) return `${rest} min`;
  return rest === 0 ? `${wholeHours}h` : `${wholeHours}h ${pad(rest)}`;
};
