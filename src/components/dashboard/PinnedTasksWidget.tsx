import { RiPushpin2Fill } from 'react-icons/ri';
import { useTasks } from '@/hooks/useTasks';
import { cn } from '@/utils/cn';

export function PinnedTasksWidget() {
  const { pinnedTasks, toggleComplete, openTaskDetails } = useTasks();

  if (pinnedTasks.length === 0) return null;

  return (
    <div className="glass-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <RiPushpin2Fill className="text-flow-500" aria-hidden="true" />
        <h3 className="font-display text-base font-semibold text-ink-800 dark:text-white">Pinned</h3>
      </div>
      <ul className="space-y-2.5">
        {pinnedTasks.slice(0, 6).map((task) => (
          <li key={task.id} className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => toggleComplete(task.id)}
              aria-label={task.completed ? `Mark "${task.title}" as not complete` : `Mark "${task.title}" as complete`}
              className={cn(
                'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                task.completed ? 'border-transparent bg-flow-gradient' : 'border-ink-300 hover:border-flow-500 dark:border-ink-500',
              )}
            />
            <button
              type="button"
              onClick={() => openTaskDetails(task)}
              className={cn(
                'truncate text-left text-sm text-ink-600 hover:text-flow-600 dark:text-ink-300 dark:hover:text-flow-300',
                task.completed && 'text-ink-400 line-through',
              )}
            >
              {task.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
