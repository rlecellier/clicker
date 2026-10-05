import { Button } from '@base-ui/react/button';
import { Briefcase, Smartphone, type LucideIcon } from 'lucide-react';

import type { JobSource } from '@game/jobs';

import styles from './JobPicker.module.css';

type JobPickerProps = {
  jobs: { id: string; title: string; source: JobSource }[];
  onPick: (id: string) => void;
};

const SOURCES: Record<JobSource, { Icon: LucideIcon; text: string }> = {
  phone: { Icon: Smartphone, text: 'On your phone' },
};

// The jobs the player can take, one button each.
export const JobPicker = ({ jobs, onPick }: JobPickerProps) => {
  return (
    <ul className={styles.root}>
      {jobs.map((job) => {
        const { Icon, text } = SOURCES[job.source];
        return (
          <li key={job.id}>
            <Button
              className={styles.job}
              onClick={() => {
                onPick(job.id);
              }}
            >
              <Briefcase aria-hidden size={18} /> {job.title}
              <span className={styles.source}>
                <Icon aria-hidden size={14} /> {text}
              </span>
            </Button>
          </li>
        );
      })}
    </ul>
  );
};
