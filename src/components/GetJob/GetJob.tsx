import { Button } from '@base-ui/react/button';
import { Briefcase } from 'lucide-react';

import { IconRow } from '@component/IconRow';
import { JobPicker } from '@component/JobPicker';
import { ModalSheet } from '@component/ModalSheet';
import { useGetJob } from '@hook/useGetJob';

import styles from './GetJob.module.css';

// The "Look for a job" button and the sheet of jobs it opens.
export const GetJob = () => {
  const { canGetJob, isBusy, isOpen, jobs, open, close, pick } = useGetJob();
  if (!canGetJob) return;

  return (
    <>
      <IconRow icon={Briefcase}>
        <Button className={styles.root} disabled={isBusy} onClick={open}>
          Look for a job
        </Button>
      </IconRow>
      <ModalSheet
        isOpen={isOpen}
        title="Look for a job"
        description="Pick the job you want to do. Looking takes an hour."
        onClose={close}
      >
        <JobPicker jobs={jobs} onPick={pick} />
      </ModalSheet>
    </>
  );
};
