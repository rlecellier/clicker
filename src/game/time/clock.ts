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

// "07:30" -> 7.5, undefined when the text is not a time of the day
export const parseClock = (text: string) => {
  const match = /^(\d{2}):(\d{2})$/.exec(text);
  if (!match) return;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours < 24 && minutes < 60 ? hours + minutes / 60 : undefined;
};
