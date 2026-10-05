import { GameBriefing } from '@component/GameBriefing';
import { GenderPicker } from '@component/GenderPicker';
import { TitleScreen } from '@component/TitleScreen';
import { useStartFlow } from '@hook/useStartFlow';
import { START_AGE } from '@game/age';
import { INITIAL_COINS } from '@game/coins';

type StartPageProps = {
  onStart: () => void;
};

export const StartPage = ({ onStart }: StartPageProps) => {
  const { step, gender, showGender, pickGender } = useStartFlow();

  if (step === 'title') return <TitleScreen onNewGame={showGender} />;
  if (step === 'gender') return <GenderPicker onPick={pickGender} />;
  return (
    <GameBriefing
      age={START_AGE}
      coins={INITIAL_COINS}
      gender={gender}
      onStart={onStart}
    />
  );
};
