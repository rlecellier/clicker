import { Button } from '@base-ui/react/button';
import { Briefcase } from 'lucide-react';

import { JobPicker } from '@component/JobPicker';
import { ModalSheet } from '@component/ModalSheet';
import { useGetJob } from '@hook/useGetJob';

// The "Get a Job" button and the sheet of jobs it opens.
export const GetJob = () => {
  const { canGetJob, isOpen, jobs, open, close, pick } = useGetJob();
  if (!canGetJob) return;

  return (
    <>
      <Button onClick={open}>
        <Briefcase aria-hidden size={18} /> Get a Job
      </Button>
      <ModalSheet
        isOpen={isOpen}
        title="Get a Job"
        description="Pick the job you want to do."
        onClose={close}
      >
        <JobPicker jobs={jobs} onPick={pick} />
      </ModalSheet>
    </>
  );
};
