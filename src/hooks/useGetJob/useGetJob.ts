import { useState } from 'react';

import { useGameContext } from '@context/GameContext';
import { isJobId, JOB_IDS, JOBS } from '@game/jobs';

// The "Get a Job" button: it opens the list of jobs, and picking one takes it.
// Only a player without a job can get one.
export const useGetJob = () => {
  const { job, takeJob } = useGameContext();
  const [isOpen, setIsOpen] = useState(false);

  return {
    canGetJob: !job,
    isOpen,
    jobs: JOB_IDS.map((id) => ({ id, title: JOBS[id].title })),
    open: () => {
      setIsOpen(true);
    },
    close: () => {
      setIsOpen(false);
    },
    pick: (id: string) => {
      if (!isJobId(id)) return;
      takeJob(id);
      setIsOpen(false);
    },
  };
};
