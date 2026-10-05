import { useState } from 'react';

import { useGameContext } from '@context/GameContext';
import { isJobId, JOB_IDS, JOBS } from '@game/jobs';

// The "Look for a job" button: it opens the list of jobs, and picking one takes
// it, after an hour of searching. Only a player at home without a job can look
// for one.
export const useGetJob = () => {
  const { activity, job, location, takeJob } = useGameContext();
  const [isOpen, setIsOpen] = useState(false);

  return {
    canGetJob: !job && location === 'home',
    // one thing at a time
    isBusy: activity !== undefined,
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
