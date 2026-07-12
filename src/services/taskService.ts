import { generateId } from '@/utils/id';
import { getNextRecurrenceDate } from '@/utils/date';
import type { DeletedTask, Task, TaskFormValues, TaskInput } from '@/types';

/** Convert raw react-hook-form string values into typed, storage-ready fields. */
export function buildTaskInput(values: TaskFormValues): TaskInput {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    category: values.category,
    dueDate: values.dueDate ? new Date(`${values.dueDate}T09:00:00`).toISOString() : null,
    priority: values.priority,
    estimatedTime: values.estimatedTime ? Number(values.estimatedTime) : null,
    notes: values.notes.trim(),
    recurrence: values.recurrence,
  };
}

export function createTask(input: TaskInput): Task {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    ...input,
    completed: false,
    archived: false,
    pinned: false,
    favorite: false,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  };
}

export function applyTaskUpdate(task: Task, input: TaskInput): Task {
  return {
    ...task,
    ...input,
    updatedAt: new Date().toISOString(),
  };
}

export function duplicateTask(task: Task): Task {
  const now = new Date().toISOString();
  return {
    ...task,
    id: generateId(),
    title: `${task.title} (Copy)`,
    completed: false,
    completedAt: null,
    pinned: false,
    createdAt: now,
    updatedAt: now,
  };
}

interface CompletionResult {
  updated: Task;
  nextOccurrence: Task | null;
  removeOccurrenceId?: string;
}

/** Toggle completion. If the task recurs and is being completed, spin off the next occurrence. */
export function toggleTaskCompletion(task: Task): CompletionResult {
  const now = new Date().toISOString();

  if (task.completed) {
    const removeOccurrenceId = task.nextOccurrenceId;
    const { nextOccurrenceId: _, ...cleanTask } = task;
    return {
      updated: { ...cleanTask, completed: false, completedAt: null, updatedAt: now },
      nextOccurrence: null,
      removeOccurrenceId,
    };
  }

  let nextOccurrence: Task | null = null;
  let nextOccurrenceId: string | undefined = undefined;

  if (task.recurrence !== 'none') {
    const nextId = generateId();
    nextOccurrenceId = nextId;
    nextOccurrence = {
      ...task,
      id: nextId,
      dueDate: getNextRecurrenceDate(task.dueDate, task.recurrence),
      completed: false,
      completedAt: null,
      pinned: false,
      favorite: false,
      createdAt: now,
      updatedAt: now,
    };
  }

  const updated: Task = {
    ...task,
    completed: true,
    completedAt: now,
    updatedAt: now,
    nextOccurrenceId,
  };

  return { updated, nextOccurrence };
}

export function moveTaskToTrash(task: Task): DeletedTask {
  return { ...task, deletedAt: new Date().toISOString() };
}

export function restoreTaskFromTrash(deleted: DeletedTask): Task {
  const { deletedAt: _deletedAt, ...task } = deleted;
  return task;
}
