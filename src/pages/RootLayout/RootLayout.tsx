import { Button } from '@base-ui/react/button';
import { Menu, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Link, Outlet } from 'react-router';

import { AgeCounter } from '@component/AgeCounter';
import { CaloriesStatus } from '@component/CaloriesStatus';
import { DayTimeline } from '@component/DayTimeline';
import { GameClock } from '@component/GameClock';
import { MoneyCounter } from '@component/MoneyCounter';
import { Sidebar } from '@component/Sidebar';
import { GameProvider, useGameContext } from '@context/GameContext';
import { birthDateOf } from '@game/age';
import { newGameState } from '@game/gameState';
import { getCaloriesStatus } from '@game/nutrition';
import { readSave } from '@game/save';
import { gameStartOf, HOURS_PER_DAY, momentOf } from '@game/time';

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
              <X aria-hidden size={18} />
            ) : (
              <Menu aria-hidden size={18} />
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
          <GameClock date={date} time={time} />
          <CaloriesStatus status={getCaloriesStatus(calories)} />
          <AgeCounter years={age} />
        </div>
      </header>
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
  // The saved game is read once, when the page opens.
  const [savedGame] = useState(
    () =>
      readSave(localStorage) ??
      (() => {
        // a new game starts at the date and time of the player
        const now = new Date();
        return newGameState({
          ...gameStartOf(now),
          birthDate: birthDateOf(now),
        });
      })(),
  );

  return (
    <GameProvider initialState={savedGame} persist>
      <Layout />
    </GameProvider>
  );
};
