import { useMemo } from 'react';
import { FiClock, FiRotateCcw, FiSlash } from 'react-icons/fi';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/Button';
import { CategoryBadge, PriorityBadge } from '@/components/tasks/Badges';
import { formatMinutesToHours } from '@/utils/date';
import { isTerminatedTask } from '@/utils/taskUtils';

export function TerminatedTasksWidget() {
  const { tasks, getCategory, reactivateTask, openTaskDetails } = useTasks();

  const terminatedTasks = useMemo(() => {
    const nowMs = Date.now();
    return tasks.filter((t) => !t.archived && !t.completed && isTerminatedTask(t, nowMs));
  }, [tasks]);

  if (terminatedTasks.length === 0) {
    return null;
  }

  return (
    <div className="glass-card p-5 border-rose-500/30 bg-rose-500/[0.02] dark:bg-rose-500/[0.04]">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400">
          <FiSlash className="h-5 w-5 shrink-0" aria-hidden="true" />
          <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">
            Auto-Terminated Tasks ({terminatedTasks.length})
          </h3>
        </div>
        <span className="text-xs text-ink-400">
          Tasks not completed within estimated time or 24 hours are automatically terminated.
        </span>
      </div>

      <div className="space-y-2.5">
        {terminatedTasks.slice(0, 4).map((task) => {
          const category = getCategory(task.category);
          const reasonText =
            task.terminationReason === 'estimated_time_exceeded'
              ? `Exceeded ${formatMinutesToHours(task.estimatedTime)} limit`
              : task.terminationReason === 'twenty_four_hours_exceeded'
              ? 'Exceeded 24-hour time limit'
              : task.estimatedTime
              ? `Exceeded ${formatMinutesToHours(task.estimatedTime)} limit`
              : 'Exceeded 24-hour limit';

          return (
            <div
              key={task.id}
              className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-rose-500/20 bg-white/70 dark:bg-ink-800/60 shadow-sm transition-all hover:border-rose-500/40"
            >
              <button
                type="button"
                onClick={() => openTaskDetails(task)}
                className="min-w-0 flex-1 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                  <p className="font-medium text-ink-900 dark:text-white hover:underline truncate text-sm">
                    {task.title}
                  </p>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                  <CategoryBadge category={category} />
                  <PriorityBadge priority={task.priority} />
                  <span className="inline-flex items-center gap-1 font-semibold text-rose-500 dark:text-rose-400">
                    <FiClock className="h-3 w-3" aria-hidden="true" />
                    {reasonText}
                  </span>
                </div>
              </button>

              <Button
                variant="secondary"
                size="sm"
                leftIcon={<FiRotateCcw className="h-3.5 w-3.5" />}
                onClick={() => reactivateTask(task.id)}
                className="shrink-0"
              >
                Reactivate
              </Button>
            </div>
          );
        })}
        {terminatedTasks.length > 4 && (
          <p className="pt-1 text-center text-xs text-ink-400">
            +{terminatedTasks.length - 4} more terminated task{terminatedTasks.length - 4 === 1 ? '' : 's'} (view in Statistics or filter by Terminated)
          </p>
        )}
      </div>
    </div>
  );
}
