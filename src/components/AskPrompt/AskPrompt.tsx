import { AskDialog } from '@component/AskDialog';
import { useAskPrompt } from '@hook/useAskPrompt';

// Asks the player about the planned event that is about to start, if any.
export const AskPrompt = () => {
  const { question, accept, decline } = useAskPrompt();
  if (!question) return;

  return <AskDialog {...question} onAccept={accept} onDecline={decline} />;
};
