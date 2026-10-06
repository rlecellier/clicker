import { Smartphone, User, type LucideIcon } from 'lucide-react';

import { ActionList } from '@component/ActionList';
import type { ActionCategory } from '@game/actions';

import styles from './ActionSections.module.css';

const ICONS: Record<ActionCategory, LucideIcon | undefined> = {
  place: undefined,
  self: User,
  online: Smartphone,
};

type ActionSectionsProps = {
  // one section per category: what the place offers, what the player does by
  // themselves, what they do with their phone
  sections: {
    category: ActionCategory;
    // what the heading says
    title: string;
    rows: Parameters<typeof ActionList>[0]['rows'];
  }[];
  onPerform: (id: string) => void;
  onPick: (key: string, id: string) => void;
};

// The actions, with a heading telling where each group comes from.
export const ActionSections = ({
  sections,
  onPerform,
  onPick,
}: ActionSectionsProps) => {
  return (
    <div className={styles.root}>
      {sections.map(({ category, title, rows }) => {
        const Icon = ICONS[category];
        return (
          <section
            key={category}
            className={styles.section}
            data-category={category}
            aria-label={title}
          >
            <h3 className={styles.title}>
              {Icon && <Icon aria-hidden size={14} />}
              {title}
            </h3>
            <ActionList rows={rows} onPerform={onPerform} onPick={onPick} />
          </section>
        );
      })}
    </div>
  );
};
