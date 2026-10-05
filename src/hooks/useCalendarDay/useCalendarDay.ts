import { useState } from 'react';

// The day the calendar shows: the current day of the game until the player
// moves it, one step at a time (never before the first day), and back to it
// on demand.
export const useCalendarDay = (currentDay: number) => {
  const [chosenDay, setChosenDay] = useState<number>();
  const selectedDay = chosenDay ?? currentDay;

  return {
    selectedDay,
    isOnToday: selectedDay === currentDay,
    move: (delta: number) => {
      setChosenDay(Math.max(0, selectedDay + delta));
    },
    goToToday: () => {
      setChosenDay(undefined);
    },
  };
};
