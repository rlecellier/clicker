import { Button } from '@base-ui/react/button';
import { Briefcase, House } from 'lucide-react';

import { ActionList } from '@component/ActionList';
import { ActivityProgress } from '@component/ActivityProgress';
import { BookProgress } from '@component/BookProgress';
import { GetJob } from '@component/GetJob';
import { JobStatus } from '@component/JobStatus';
import { LocationIndicator } from '@component/LocationIndicator';
import { useGameContext } from '@context/GameContext';
import { useGamePanel } from '@hook/useGamePanel';

import styles from './GamePage.module.css';

export const GamePage = () => {
  const { currentBook, bookHours } = useGameContext();
  const { location, activity, job, travel, rows, perform, goTo } =
    useGamePanel();

  return (
    <div className={styles.content}>
      <LocationIndicator location={location} />
      {job && <JobStatus {...job} />}
      <div className={styles.actions}>
        {travel && (
          <Button
            disabled={activity !== undefined}
            onClick={() => {
              goTo(travel.place);
            }}
          >
            {travel.place === 'work' ? (
              <Briefcase aria-hidden size={18} />
            ) : (
              <House aria-hidden size={18} />
            )}{' '}
            {travel.label}
          </Button>
        )}
        <GetJob />
        {activity && <ActivityProgress {...activity} />}
        <ActionList rows={rows} onPerform={perform} />
        {currentBook && (
          <BookProgress
            title={currentBook.title}
            hoursRead={bookHours}
            totalHours={currentBook.hours}
          />
        )}
      </div>
    </div>
  );
};
