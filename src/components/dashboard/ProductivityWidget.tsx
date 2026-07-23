import { ProgressRing } from '@/components/ui/ProgressRing';
import type { TaskStats } from '@/types';

export function ProductivityWidget({ stats }: { stats: TaskStats }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center gap-4 p-6 text-center">
      <h3 className="font-display text-lg font-semibold text-ink-800 dark:text-white">Productivity</h3>
      <ProgressRing value={stats.productivity} label="completed" />
      <p className="text-sm text-ink-400">
        {stats.completed} of {stats.total} active task{stats.total === 1 ? '' : 's'} completed
        {stats.terminated > 0 ? ` (${stats.terminated} auto-terminated)` : ''}
      </p>
    </div>
  );
}
