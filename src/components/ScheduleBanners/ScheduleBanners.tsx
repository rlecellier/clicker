import { DayTimeline } from '@component/DayTimeline';
import { TaskBanner } from '@component/TaskBanner';
import { useSchedule } from '@hook/useSchedule';
import { HOURS_PER_DAY, weekdayLabel } from '@game/time';

// Three banners stacked: the days going by, the current task, the next one.
export const ScheduleBanners = () => {
  const { weekHour, dayPosition, schedule, current, next } = useSchedule();
  const hour = Math.floor(weekHour % HOURS_PER_DAY);

  return (
    <div>
      <DayTimeline
        schedule={schedule}
        dayPosition={dayPosition}
        label={`${weekdayLabel(Math.floor(dayPosition))}, ${String(hour).padStart(2, '0')}:00`}
      />
      <TaskBanner label="Now" {...current} />
      <TaskBanner label="Next" {...next} />
    </div>
  );
};
