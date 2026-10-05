import { Refrigerator } from 'lucide-react';

import { Gauge } from '@component/Gauge';
import { FRIDGE_MAX } from '@game/fridge';

type FridgeGaugeProps = {
  // portions left, between 0 and FRIDGE_MAX
  fridge: number;
};

export const FridgeGauge = ({ fridge }: FridgeGaugeProps) => (
  <Gauge
    value={fridge}
    max={FRIDGE_MAX}
    label="Fridge"
    valueText={`${fridge} / ${FRIDGE_MAX}`}
    title={
      <>
        <Refrigerator aria-hidden size={14} /> {fridge} / {FRIDGE_MAX}
      </>
    }
  />
);
