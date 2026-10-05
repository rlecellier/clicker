import { Brain } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Gauge } from '@component/Gauge';
import { BRAIN_CAP } from '@game/sleep';

type BrainGaugeProps = Pick<ComponentProps<typeof Gauge>, 'size'> & {
  // gauge between 0 and 100
  brain: number;
};

export const BrainGauge = ({ brain, size }: BrainGaugeProps) => (
  <Gauge
    value={brain}
    max={BRAIN_CAP}
    size={size}
    label="Brain"
    valueText={`${Math.round(brain)}%`}
    title={
      <>
        <Brain aria-hidden size={14} /> {Math.round(brain)}%
      </>
    }
  />
);
