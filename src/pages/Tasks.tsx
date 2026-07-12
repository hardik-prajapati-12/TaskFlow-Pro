import { FiPlus } from 'react-icons/fi';
import { useTasks } from '@/hooks/useTasks';
import { SearchBar } from '@/components/tasks/SearchBar';
import { FilterBar } from '@/components/tasks/FilterBar';
import { TaskList } from '@/components/tasks/TaskList';
import { BulkActionsBar } from '@/components/tasks/BulkActionsBar';
import { Button } from '@/components/ui/Button';

export default function Tasks() {
  const { filteredTasks, openCreateForm } = useTasks();

  return (
    <div className="space-y-5 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Tasks</h1>
          <p className="mt-1 text-sm text-ink-400">
            {filteredTasks.length} task{filteredTasks.length === 1 ? '' : 's'} in this view
          </p>
        </div>
        <Button leftIcon={<FiPlus aria-hidden="true" />} onClick={openCreateForm}>
          New Task
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SearchBar />
      </div>

      <FilterBar />
      <TaskList tasks={filteredTasks} />
      <BulkActionsBar />
    </div>
  );
}
