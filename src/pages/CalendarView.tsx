import { useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { FiPlus } from 'react-icons/fi';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/Button';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

const PRIORITY_COLORS: Record<CalendarEvent['priority'], string> = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#22C55E',
};

export default function CalendarView() {
  const { tasks, openTaskDetails, openCreateForm } = useTasks();
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());

  const events: CalendarEvent[] = useMemo(
    () =>
      tasks
        .filter((t) => t.dueDate && !t.archived)
        .map((t) => {
          const due = new Date(t.dueDate as string);
          return {
            id: t.id,
            title: t.title,
            start: due,
            end: due,
            priority: t.priority,
            completed: t.completed,
          };
        }),
    [tasks],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Calendar</h1>
          <p className="mt-1 text-sm text-ink-400">Every task with a due date, at a glance.</p>
        </div>
        <Button leftIcon={<FiPlus aria-hidden="true" />} onClick={openCreateForm}>
          New Task
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-ink-400">
        {(['high', 'medium', 'low'] as const).map((p) => (
          <span key={p} className="flex items-center gap-1.5 capitalize">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[p] }} />
            {p} priority
          </span>
        ))}
      </div>

      <div className="tf-calendar-wrap glass-card p-4 sm:p-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={date}
          onNavigate={setDate}
          view={view}
          onView={setView}
          views={['month', 'week', 'day', 'agenda']}
          style={{ height: 640 }}
          popup
          eventPropGetter={(event: CalendarEvent) => ({
            style: {
              backgroundColor: PRIORITY_COLORS[event.priority],
              opacity: event.completed ? 0.5 : 1,
              textDecoration: event.completed ? 'line-through' : 'none',
            },
          })}
          onSelectEvent={(event: CalendarEvent) => {
            const task = tasks.find((t) => t.id === event.id);
            if (task) openTaskDetails(task);
          }}
          onSelectSlot={() => openCreateForm()}
          selectable
        />
      </div>
    </div>
  );
}
