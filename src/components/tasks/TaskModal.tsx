import type { ReactNode } from 'react';
import { FiCheckCircle, FiEdit2 } from 'react-icons/fi';
import { useTasks } from '@/hooks/useTasks';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CategoryBadge, PriorityBadge } from './Badges';
import { formatDateTime, formatFullDate } from '@/utils/date';
import { cn } from '@/utils/cn';

export function TaskModal() {
  const { viewingTask, isTaskDetailsOpen, closeTaskDetails, getCategory, toggleComplete, openEditForm } =
    useTasks();

  if (!viewingTask) return null;
  const task = viewingTask;
  const category = getCategory(task.category);

  return (
    <Modal
      isOpen={isTaskDetailsOpen}
      onClose={closeTaskDetails}
      title="Task details"
      size="md"
      footer={
        <>
          <Button
            variant="secondary"
            leftIcon={<FiEdit2 aria-hidden="true" />}
            onClick={() => {
              closeTaskDetails();
              openEditForm(task);
            }}
          >
            Edit
          </Button>
          <Button
            leftIcon={<FiCheckCircle aria-hidden="true" />}
            onClick={() => {
              closeTaskDetails();
              toggleComplete(task.id);
            }}
          >
            {task.completed ? 'Mark as pending' : 'Mark complete'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <h3
            className={cn(
              'font-display text-xl font-semibold text-ink-900 dark:text-white',
              task.completed && 'text-ink-400 line-through',
            )}
          >
            {task.title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <CategoryBadge category={category} />
            <PriorityBadge priority={task.priority} />
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-medium',
                task.archived
                  ? 'bg-ink-200 text-ink-600 dark:bg-ink-600 dark:text-ink-200'
                  : task.completed
                    ? 'bg-signal-100 text-signal-700 dark:bg-signal-900/40 dark:text-signal-300'
                    : 'bg-flow-100 text-flow-700 dark:bg-flow-900/40 dark:text-flow-300',
              )}
            >
              {task.archived ? 'Archived' : task.completed ? 'Completed' : 'Pending'}
            </span>
            {task.pinned && <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-500 dark:bg-ink-700 dark:text-ink-300">📌 Pinned</span>}
            {task.favorite && <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-500 dark:bg-ink-700 dark:text-ink-300">⭐ Favorite</span>}
          </div>
        </div>

        {task.description && (
          <Field label="Description">
            <p className="whitespace-pre-wrap text-sm text-ink-600 dark:text-ink-300">{task.description}</p>
          </Field>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field label="Due date">
            <p className="text-sm text-ink-700 dark:text-ink-200">{formatFullDate(task.dueDate)}</p>
          </Field>
          <Field label="Estimated time">
            <p className="text-sm text-ink-700 dark:text-ink-200">
              {task.estimatedTime ? `${task.estimatedTime} minutes` : 'Not set'}
            </p>
          </Field>
        </div>

        {task.notes && (
          <Field label="Notes">
            <p className="whitespace-pre-wrap text-sm text-ink-600 dark:text-ink-300">{task.notes}</p>
          </Field>
        )}

        {task.recurrence !== 'none' && (
          <Field label="Repeats">
            <p className="text-sm capitalize text-ink-700 dark:text-ink-200">{task.recurrence}</p>
          </Field>
        )}

        <div className="grid grid-cols-2 gap-4 border-t border-ink-100 pt-4 dark:border-ink-700">
          <Field label="Created">
            <p className="text-xs text-ink-400">{formatDateTime(task.createdAt)}</p>
          </Field>
          <Field label="Last updated">
            <p className="text-xs text-ink-400">{formatDateTime(task.updatedAt)}</p>
          </Field>
        </div>
      </div>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</p>
      {children}
    </div>
  );
}
