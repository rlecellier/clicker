import { BookOpen } from 'lucide-react';

import { Gauge } from '@component/Gauge';

type BookProgressProps = {
  title: string;
  // hours of reading spent on the book so far
  hoursRead: number;
  totalHours: number;
};

export const BookProgress = ({
  title,
  hoursRead,
  totalHours,
}: BookProgressProps) => {
  const percent = Math.floor((hoursRead / totalHours) * 100);

  return (
    <Gauge
      value={hoursRead}
      max={totalHours}
      size="full"
      tone="success"
      label={title}
      valueText={`${percent}%`}
      title={
        <>
          <BookOpen aria-hidden size={14} /> {percent}%
        </>
      }
      detail={`${Math.floor(hoursRead)} / ${totalHours} h`}
    />
  );
};
