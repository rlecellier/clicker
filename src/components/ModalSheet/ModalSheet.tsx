import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

import styles from './ModalSheet.module.css';

type ModalSheetProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  // closes the sheet; without it the sheet can only be closed by its content
  onClose?: () => void;
  children: ReactNode;
};

// A modal on a large screen, a full page on mobile.
export const ModalSheet = ({
  isOpen,
  title,
  description,
  onClose,
  children,
}: ModalSheetProps) => {
  // Closed means gone from the page at once, with no exit animation to wait for.
  if (!isOpen) return;

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose?.();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.popup}>
          <header className={styles.header}>
            <Dialog.Title className={styles.title}>{title}</Dialog.Title>
            {onClose && (
              <Dialog.Close className={styles.close} aria-label="Close">
                <X aria-hidden size={18} />
              </Dialog.Close>
            )}
          </header>
          {description && (
            <Dialog.Description className={styles.description}>
              {description}
            </Dialog.Description>
          )}
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
