import { Button } from '@base-ui/react/button';
import { CalendarPlus } from 'lucide-react';

import { AddEventForm } from '@component/AddEventForm';
import { ModalSheet } from '@component/ModalSheet';
import { useAddEvent } from '@hook/useAddEvent';
import { dayOfMonth, weekdayLabel } from '@game/time';

type AddEventProps = {
  // the day of the game shown in the calendar
  shownDay: number;
};

// The "Add event" button and the sheet with the form to plan a new event.
export const AddEvent = ({ shownDay }: AddEventProps) => {
  const { isOpen, day, draft, problem, open, close, change, submit } =
    useAddEvent(shownDay);

  return (
    <>
      <Button aria-label="Add event" onClick={open}>
        <CalendarPlus aria-hidden size={18} />
      </Button>
      <ModalSheet
        isOpen={isOpen}
        title="Add event"
        description="Plan something to do, and decide how it starts."
        onClose={close}
      >
        <AddEventForm
          values={draft}
          dayLabel={`${weekdayLabel(day)} ${dayOfMonth(day)}`}
          problem={problem}
          onChange={change}
          onSubmit={submit}
        />
      </ModalSheet>
    </>
  );
};
