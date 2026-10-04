import { Receipt, Utensils } from 'lucide-react';
import { useEffect } from 'react';
import { NavLink } from 'react-router';

import { BrainGauge } from '@component/BrainGauge';
import { CaloriesGauge } from '@component/CaloriesGauge';
import { DreamGauge } from '@component/DreamGauge';

import styles from './Sidebar.module.css';

type SidebarProps = {
  id: string;
  calories: number;
  fat: number;
  brain: number;
  dreamGauge: number;
  dreams: number;
  isSleeping: boolean;
  // only matters on mobile: from tablet up the sidebar is always shown
  isOpen: boolean;
  onClose: () => void;
};

const LINKS = [
  { to: '/', label: 'Game', Icon: Utensils },
  { to: '/expenses', label: 'Expenses', Icon: Receipt },
];

// The gauges and the pages menu: slides in on mobile, always shown from
// tablet up.
export const Sidebar = ({
  id,
  calories,
  fat,
  brain,
  dreamGauge,
  dreams,
  isSleeping,
  isOpen,
  onClose,
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
        <CaloriesGauge calories={calories} fat={fat} />
        <BrainGauge brain={brain} isSleeping={isSleeping} />
        <DreamGauge dreamGauge={dreamGauge} dreams={dreams} />
        <nav aria-label="Pages" className={styles.nav}>
          {LINKS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={styles.link}
              onClick={onClose}
            >
              <Icon aria-hidden size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};
