import { GameBriefing } from '@component/GameBriefing';
import { TitleScreen } from '@component/TitleScreen';
import { useStartFlow } from '@hook/useStartFlow';
import { START_AGE } from '@game/age';
import { INITIAL_COINS } from '@game/coins';

type StartPageProps = {
  onStart: () => void;
};

export const StartPage = ({ onStart }: StartPageProps) => {
  const { step, showBriefing } = useStartFlow();

  return step === 'title' ? (
    <TitleScreen onNewGame={showBriefing} />
  ) : (
    <GameBriefing age={START_AGE} coins={INITIAL_COINS} onStart={onStart} />
  );
};
