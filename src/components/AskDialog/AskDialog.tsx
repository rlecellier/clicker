import { Button } from '@base-ui/react/button';
import { Check, X } from 'lucide-react';

import { ModalSheet } from '@component/ModalSheet';

import styles from './AskDialog.module.css';

type AskDialogProps = {
  // what the player is asked to do, e.g. "Read a book"
  title: string;
  // when it happens, e.g. "20:00 – 23:00"
  detail: string;
  onAccept: () => void;
  onDecline: () => void;
};

// Asks the player whether to do a planned event, and cannot be dismissed:
// the game waits for an answer.
export const AskDialog = ({
  title,
  detail,
  onAccept,
  onDecline,
}: AskDialogProps) => {
  return (
    <ModalSheet
      isOpen
      title={title}
      description={`${detail}. Do you want to do this now?`}
    >
      <div className={styles.answers}>
        <Button onClick={onAccept}>
          <Check aria-hidden size={18} /> Do it
        </Button>
        <Button className={styles.decline} onClick={onDecline}>
          <X aria-hidden size={18} /> Skip
        </Button>
      </div>
    </ModalSheet>
  );
};
