import { useGameContext } from '@context/GameContext';
import { formatClock } from '@game/time';

// The `ask` event the game is waiting on, to show as a question. Nothing while
// the game runs.
export const useAskPrompt = () => {
  const { asking, answerAsk } = useGameContext();

  return {
    question: asking && {
      title: asking.event.title,
      detail: `${formatClock(asking.event.start)} – ${formatClock(asking.event.end)}`,
    },
    accept: () => {
      answerAsk(true);
    },
    decline: () => {
      answerAsk(false);
    },
  };
};
