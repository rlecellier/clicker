import { Button } from '@base-ui/react/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Link, Outlet } from 'react-router';

import { AgeCounter } from '@component/AgeCounter';
import { CaloriesStatus } from '@component/CaloriesStatus';
import { DayTimeline } from '@component/DayTimeline';
import { GameClock } from '@component/GameClock';
import { MoneyCounter } from '@component/MoneyCounter';
import { Sidebar } from '@component/Sidebar';
import { GameProvider, useGameContext } from '@context/GameContext';
import { useGameStart } from '@hook/useGameStart';
import { useMediaQuery } from '@hook/useMediaQuery';
import { StartPage } from '@page/StartPage';
import { getCaloriesStatus } from '@game/nutrition';
import { HOURS_PER_DAY, momentOf } from '@game/time';

import styles from './RootLayout.module.css';

const Layout = () => {
  const {
    age,
    coins,
    calories,
    fridge,
    body,
    brain,
    dreamGauge,
    dreams,
    elapsedHours,
    history,
    job,
    origin,
    restart,
  } = useGameContext();
  const { date, time } = momentOf(origin, elapsedHours);
  // the clock sits above the days strip on mobile, where the header is tight
  const isLargeScreen = useMediaQuery('(min-width: 640px)');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Button
            className={styles.menuButton}
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            aria-controls="sidebar"
            onClick={() => {
              setIsMenuOpen((isOpen) => !isOpen);
            }}
          >
            {isMenuOpen ? (
              <ChevronLeft aria-hidden size={18} />
            ) : (
              <ChevronRight aria-hidden size={18} />
            )}
          </Button>
          <h1 className={styles.title}>
            <Link to="/" className={styles.titleLink}>
              Clicker
            </Link>
          </h1>
        </div>
        <div className={styles.status}>
          <MoneyCounter coins={coins} />
          {isLargeScreen && <GameClock date={date} time={time} />}
          <CaloriesStatus status={getCaloriesStatus(calories)} />
          <AgeCounter years={age} />
        </div>
      </header>
      {!isLargeScreen && (
        <div className={styles.clockBar}>
          <GameClock date={date} time={time} />
        </div>
      )}
      <DayTimeline
        origin={origin}
        history={history}
        job={job}
        dayPosition={elapsedHours / HOURS_PER_DAY}
        label={`${date}, ${time}`}
      />
      <div className={styles.body}>
        <Sidebar
          id="sidebar"
          calories={calories}
          fridge={fridge}
          body={body}
          brain={brain}
          dreamGauge={dreamGauge}
          dreams={dreams}
          isOpen={isMenuOpen}
          onClose={closeMenu}
          onRestart={restart}
        />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const RootLayout = () => {
  const { game, start } = useGameStart();

  if (!game) return <StartPage onStart={start} />;

  return (
    <GameProvider initialState={game} persist>
      <Layout />
    </GameProvider>
  );
};
