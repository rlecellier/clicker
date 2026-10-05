import {
  CalendarDays,
  Gamepad2,
  MapPin,
  RotateCcw,
  Trophy,
  User,
  Wallet,
} from 'lucide-react';
import { useEffect } from 'react';
import { NavLink } from 'react-router';

import { BodyGauge } from '@component/BodyGauge';
import { BrainGauge } from '@component/BrainGauge';
import { CaloriesGauge } from '@component/CaloriesGauge';
import { DreamGauge } from '@component/DreamGauge';
import { FridgeGauge } from '@component/FridgeGauge';
import type { Body } from '@game/body';

import styles from './Sidebar.module.css';

type SidebarProps = {
  id: string;
  calories: number;
  fridge: number;
  body: Body;
  brain: number;
  dreamGauge: number;
  dreams: number;
  // only matters on mobile: unfolds the icon rail, from tablet up the sidebar is always shown
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
};

const LINKS = [
  { to: '/', label: 'Game', Icon: Gamepad2 },
  { to: '/calendar', label: 'Calendar', Icon: CalendarDays },
  { to: '/balance', label: 'Balance', Icon: Wallet },
  { to: '/places', label: 'Places', Icon: MapPin },
  { to: '/profile', label: 'Profile', Icon: User },
  { to: '/achievements', label: 'Achievements', Icon: Trophy },
];

// The gauges and the pages menu: on mobile it is a rail of icons that unfolds
// over the page, from tablet up it is always fully shown.
export const Sidebar = ({
  id,
  calories,
  fridge,
  body,
  brain,
  dreamGauge,
  dreams,
  isOpen,
  onClose,
  onRestart,
}: SidebarProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={styles.backdrop}
        data-open={isOpen || undefined}
        onClick={onClose}
        aria-hidden
      />
      <aside id={id} className={styles.panel} data-open={isOpen || undefined}>
        <div className={styles.content}>
          <div className={styles.gauges}>
            <CaloriesGauge calories={calories} />
            <FridgeGauge fridge={fridge} />
            <BodyGauge
              fatPercent={body.fatPercent}
              musclePercent={body.musclePercent}
            />
            <BrainGauge brain={brain} />
            <DreamGauge dreamGauge={dreamGauge} dreams={dreams} />
          </div>
          <nav aria-label="Pages" className={styles.nav}>
            {LINKS.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={styles.link}
                title={label}
                onClick={onClose}
              >
                <Icon aria-hidden size={18} />
                <span className={styles.label}>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <button
          type="button"
          className={styles.restart}
          title="Restart Game"
          onClick={() => {
            onRestart();
            onClose();
          }}
        >
          <RotateCcw aria-hidden size={18} />
          <span className={styles.label}>Restart Game</span>
        </button>
      </aside>
    </>
  );
};
