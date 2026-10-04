import { Button } from '@base-ui/react/button';
import { Briefcase } from 'lucide-react';

import styles from './JobPicker.module.css';

type JobPickerProps = {
  jobs: { id: string; title: string }[];
  onPick: (id: string) => void;
};

// The jobs the player can take, one button each.
export const JobPicker = ({ jobs, onPick }: JobPickerProps) => {
  return (
    <ul className={styles.root}>
      {jobs.map((job) => (
        <li key={job.id}>
          <Button
            className={styles.job}
            onClick={() => {
              onPick(job.id);
            }}
          >
            <Briefcase aria-hidden size={18} /> {job.title}
          </Button>
        </li>
      ))}
    </ul>
  );
};
