import { Hourglass } from 'lucide-react';

import { Gauge } from '@component/Gauge';

type ActivityProgressProps = {
  // what the player is doing
  title: string;
  // how far it is, in game hours
  done: number;
  hours: number;
};

// The action in progress and how far it is.
export const ActivityProgress = ({
  title,
  done,
  hours,
}: ActivityProgressProps) => {
  const percent = Math.floor((done / hours) * 100);

  return (
    <Gauge
      value={done}
      max={hours}
      size="full"
      inline
      label="Action in progress"
      valueText={`${title}, ${percent}%`}
      title={
        <>
          <Hourglass aria-hidden size={14} /> {title}
        </>
      }
      detail={`${percent}%`}
    />
  );
};
