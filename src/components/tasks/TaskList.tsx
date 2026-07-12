import { AnimatePresence } from 'framer-motion';
import { FiInbox } from 'react-icons/fi';
import type { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useTasks } from '@/hooks/useTasks';

export interface TaskListProps {
  tasks: Task[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function TaskList({ tasks, emptyTitle = 'No tasks here yet', emptyDescription }: TaskListProps) {
  const { openCreateForm, searchQuery, resetFilters } = useTasks();

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={<FiInbox />}
        title={emptyTitle}
        description={
          emptyDescription ??
          (searchQuery ? 'Try a different search term, or clear your filters.' : 'Create your first task to get started.')
        }
        action={
          searchQuery ? (
            <Button variant="secondary" onClick={resetFilters}>
              Clear filters
            </Button>
          ) : (
            <Button onClick={openCreateForm}>Add a task</Button>
          )
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </AnimatePresence>
    </div>
  );
}
