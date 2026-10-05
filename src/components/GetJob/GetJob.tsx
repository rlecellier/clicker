import { Button } from '@base-ui/react/button';
import { Briefcase } from 'lucide-react';

import { JobPicker } from '@component/JobPicker';
import { ModalSheet } from '@component/ModalSheet';
import { useGetJob } from '@hook/useGetJob';

// The "Look for a job" button and the sheet of jobs it opens.
export const GetJob = () => {
  const { canGetJob, isBusy, isOpen, jobs, open, close, pick } = useGetJob();
  if (!canGetJob) return;

  return (
    <>
      <Button disabled={isBusy} onClick={open}>
        <Briefcase aria-hidden size={18} /> Look for a job
      </Button>
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
