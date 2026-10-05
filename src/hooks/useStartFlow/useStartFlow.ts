import { useCallback, useState } from 'react';

import type { Gender } from '@game/gender';

// The screens before the game: the title, who the player is, then what the new
// game looks like.
export type StartStep = 'title' | 'gender' | 'briefing';

export const useStartFlow = () => {
  const [step, setStep] = useState<StartStep>('title');
  const [gender, setGender] = useState<Gender>('boy');
  const showGender = useCallback(() => {
    setStep('gender');
  }, []);
  const pickGender = useCallback((picked: Gender) => {
    setGender(picked);
    setStep('briefing');
  }, []);

  return { step, gender, showGender, pickGender };
};
