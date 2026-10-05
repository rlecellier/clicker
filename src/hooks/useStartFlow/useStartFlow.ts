import { useCallback, useState } from 'react';

// The screens before the game: the title, then what the new game looks like.
export type StartStep = 'title' | 'briefing';

export const useStartFlow = () => {
  const [step, setStep] = useState<StartStep>('title');
  const showBriefing = useCallback(() => {
    setStep('briefing');
  }, []);

  return { step, showBriefing };
};
