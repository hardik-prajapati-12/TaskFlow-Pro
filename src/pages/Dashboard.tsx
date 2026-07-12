import { useMemo } from 'react';
import { FiActivity, FiCalendar, FiCheckCircle, FiList } from 'react-icons/fi';
import { useTasks } from '@/hooks/useTasks';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProductivityWidget } from '@/components/dashboard/ProductivityWidget';
import { GoalsWidget } from '@/components/dashboard/GoalsWidget';
import { PinnedTasksWidget } from '@/components/dashboard/PinnedTasksWidget';
import { QuoteWidget } from '@/components/dashboard/QuoteWidget';
import { TipWidget } from '@/components/dashboard/TipWidget';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { CategoryBadge, PriorityBadge } from '@/components/tasks/Badges';
import { formatFriendlyDate, formatFullDate, getGreeting, isTaskOverdue } from '@/utils/date';
import { cn } from '@/utils/cn';

export default function Dashboard() {
  const { tasks, stats, getCategory, openTaskDetails, openCreateForm } = useTasks();

  const upcoming = useMemo(
    () =>
      tasks
        .filter((t) => !t.completed && !t.archived && t.dueDate)
        .sort((a, b) => new Date(a.dueDate as string).getTime() - new Date(b.dueDate as string).getTime())
        .slice(0, 5),
    [tasks],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white sm:text-3xl">
          {getGreeting()}! 👋
        </h1>
        <p className="mt-1 text-sm text-ink-400">{formatFullDate(new Date().toISOString())}</p>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={<FiList />}
          title="Welcome to TaskFlow Pro"
          description="You don't have any tasks yet. Create your first one to start tracking your day."
          action={<Button onClick={openCreateForm}>Create your first task</Button>}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total tasks" value={stats.total} icon={<FiList aria-hidden="true" />} accent="flow" delay={0} />
            <StatCard
              label="Completed"
              value={stats.completed}
              icon={<FiCheckCircle aria-hidden="true" />}
              accent="signal"
              delay={0.05}
            />
            <StatCard label="Pending" value={stats.pending} icon={<FiActivity aria-hidden="true" />} accent="amber" delay={0.1} />
            <StatCard
              label="Productivity"
              value={`${stats.productivity}%`}
              icon={<FiActivity aria-hidden="true" />}
              accent="rose"
              delay={0.15}
            />
          </div>

          <div className="glass-card p-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-ink-600 dark:text-ink-300">Overall progress</span>
              <span className="text-ink-400">{stats.productivity}%</span>
            </div>
            <ProgressBar value={stats.productivity} label="Overall progress" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <ProductivityWidget stats={stats} />
                <GoalsWidget />
              </div>

              <div className="glass-card p-5">
                <div className="mb-3 flex items-center gap-2">
                  <FiCalendar className="text-flow-500" aria-hidden="true" />
                  <h3 className="font-display text-base font-semibold text-ink-800 dark:text-white">
                    Upcoming deadlines
                  </h3>
                </div>
                {upcoming.length === 0 ? (
                  <EmptyState
                    icon={<FiCalendar />}
                    title="Nothing on the horizon"
                    description="Tasks with due dates will show up here."
                  />
                ) : (
                  <ul className="divide-y divide-ink-100 dark:divide-ink-700">
                    {upcoming.map((task) => {
                      const overdue = isTaskOverdue(task.dueDate, task.completed);
                      return (
                        <li key={task.id}>
                          <button
                            type="button"
                            onClick={() => openTaskDetails(task)}
                            className="flex w-full items-center justify-between gap-3 py-2.5 text-left"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-ink-700 dark:text-ink-200">
                                {task.title}
                              </p>
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                <CategoryBadge category={getCategory(task.category)} />
                                <PriorityBadge priority={task.priority} />
                              </div>
                            </div>
                            <span
                              className={cn(
                                'shrink-0 whitespace-nowrap text-xs font-semibold',
                                overdue ? 'text-priority-high' : 'text-ink-400',
                              )}
                            >
                              {formatFriendlyDate(task.dueDate)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <PinnedTasksWidget />
              <QuoteWidget />
              <TipWidget />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
