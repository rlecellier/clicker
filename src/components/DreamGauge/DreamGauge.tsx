import { Sparkles } from 'lucide-react';

import { Gauge } from '@component/Gauge';
import { DREAM_CAP } from '@game/sleep';

import styles from './DreamGauge.module.css';

type DreamGaugeProps = {
  // gauge between 0 and 100: a dream is made each time it is full
  dreamGauge: number;
  // dreams made so far
  dreams: number;
};

export const DreamGauge = ({ dreamGauge, dreams }: DreamGaugeProps) => (
  <Gauge
    value={dreamGauge}
    max={DREAM_CAP}
    tone="sleep"
    label="Dream"
    valueText={`${Math.round(dreamGauge)}%`}
    title={
      <>
        <Sparkles aria-hidden size={14} /> {Math.round(dreamGauge)}%
      </>
    }
    detail={
      <span className={styles.count}>
        {dreams} {dreams === 1 ? 'dream' : 'dreams'}
      </span>
    }
  />
);
