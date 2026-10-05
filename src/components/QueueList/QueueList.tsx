import { Button } from '@base-ui/react/button';
import { X } from 'lucide-react';

import styles from './QueueList.module.css';

type QueueListProps = {
  // the actions waiting for the player to be at their place, in order
  items: { key: string; label: string; where: string }[];
  onRemove: (index: number) => void;
};

// What the player will do next, once at the right place.
export const QueueList = ({ items, onRemove }: QueueListProps) =>
  items.length > 0 && (
    <section className={styles.root} aria-label="Queued actions">
      <h3 className={styles.title}>Up next</h3>
      <ol className={styles.list}>
        {items.map(({ key, label, where }, index) => (
          <li key={`${key}-${String(index)}`} className={styles.item}>
            <span className={styles.label}>{label}</span>
            <span className={styles.place}>{where}</span>
            <Button
              className={styles.remove}
              aria-label={`Cancel ${label}`}
              onClick={() => {
                onRemove(index);
              }}
            >
              <X aria-hidden size={16} />
            </Button>
          </li>
        ))}
      </ol>
    </section>
  );
