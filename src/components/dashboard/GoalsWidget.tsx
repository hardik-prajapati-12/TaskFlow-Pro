import { isToday } from 'date-fns';
import { FiTarget } from 'react-icons/fi';
import { useTasks } from '@/hooks/useTasks';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { isWithinCurrentMonth, isWithinCurrentWeek, safeParseISO } from '@/utils/date';

export function GoalsWidget() {
  const { tasks, goals } = useTasks();

  const completedToday = tasks.filter(
    (t) => t.completed && isToday(safeParseISO(t.completedAt) ?? new Date(0)),
  ).length;
  const completedThisWeek = tasks.filter((t) => t.completed && isWithinCurrentWeek(t.completedAt)).length;
  const completedThisMonth = tasks.filter((t) => t.completed && isWithinCurrentMonth(t.completedAt)).length;

  const rows = [
    { label: 'Daily goal', value: completedToday, target: goals.daily },
    { label: 'Weekly goal', value: completedThisWeek, target: goals.weekly },
    { label: 'Monthly goal', value: completedThisMonth, target: goals.monthly },
  ];

  return (
    <div className="glass-card space-y-4 p-5">
      <div className="flex items-center gap-2">
        <FiTarget className="text-flow-500" aria-hidden="true" />
        <h3 className="font-display text-base font-semibold text-ink-800 dark:text-white">Goals</h3>
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-ink-500 dark:text-ink-300">{row.label}</span>
              <span className="text-ink-400">
                {row.value}/{row.target}
              </span>
            </div>
            <ProgressBar
              value={row.target === 0 ? 0 : (row.value / row.target) * 100}
              trackClassName="h-1.5"
              label={row.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
