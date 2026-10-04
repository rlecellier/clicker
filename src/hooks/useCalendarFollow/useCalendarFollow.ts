import { useState } from 'react';

// Playing, the calendar follows the game: it shows the current day and moves
// on to the next one when the day changes. Paused, it stays where it is and
// can be moved freely, one step at a time (never before the first day).
export const useCalendarFollow = (currentDay: number) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [pausedDay, setPausedDay] = useState(currentDay);

  const selectedDay = isPlaying ? currentDay : pausedDay;

  const toggle = () => {
    // playing goes to the current day; pausing stays on the day shown
    setPausedDay(currentDay);
    setIsPlaying((playing) => !playing);
  };
  const move = (delta: number) => {
    if (isPlaying) return;
    setPausedDay((day) => Math.max(0, day + delta));
  };

  return { isPlaying, selectedDay, toggle, move };
};
