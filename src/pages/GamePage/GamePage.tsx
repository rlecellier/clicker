import { ActionSections } from '@component/ActionSections';
import { BookProgress } from '@component/BookProgress';
import { GetJob } from '@component/GetJob';
import { JobStatus } from '@component/JobStatus';
import { QueueList } from '@component/QueueList';
import { LocationIndicator } from '@component/LocationIndicator';
import { MoveControl } from '@component/MoveControl';
import { useGameContext } from '@context/GameContext';
import { useGamePanel } from '@hook/useGamePanel';
import { useMove } from '@hook/useMove';
import { useQueue } from '@hook/useQueue';

import styles from './GamePage.module.css';

export const GamePage = () => {
  const { currentBook, bookHours } = useGameContext();
  const { location, job, sections, perform, pick } = useGamePanel();
  const move = useMove();
  const queue = useQueue();

  return (
    <>
      <LocationIndicator location={location} />
      {job && <JobStatus {...job} />}
      <div className={styles.actions}>
        {move && (
          <MoveControl
            destinations={move.destinations}
            value={move.destination}
            disabled={move.isBusy}
            onChange={move.pick}
            onGo={move.go}
          />
        )}
        <GetJob />
        <ActionSections sections={sections} onPerform={perform} onPick={pick} />
        <QueueList items={queue.items} onRemove={queue.remove} />
        {currentBook && (
          <BookProgress
            title={currentBook.title}
            hoursRead={bookHours}
            totalHours={currentBook.hours}
          />
        )}
      </div>
    </>
  );
};
