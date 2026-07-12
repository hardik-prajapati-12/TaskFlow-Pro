import { format } from 'date-fns';
import type { Category, Goals, Task } from '@/types';

export interface TaskFlowExport {
  version: 1;
  exportedAt: string;
  tasks: Task[];
  categories: Category[];
  goals: Goals;
}

export function buildExportPayload(tasks: Task[], categories: Category[], goals: Goals): TaskFlowExport {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    tasks,
    categories,
    goals,
  };
}

/** Trigger a browser download of the current tasks/categories/goals as a JSON file. */
export function downloadTasksAsJson(tasks: Task[], categories: Category[], goals: Goals): void {
  const payload = buildExportPayload(tasks, categories, goals);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `docvault-export-${format(new Date(), 'yyyy-MM-dd-HHmm')}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export class ImportValidationError extends Error {}

function isTaskLike(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false;
  const t = value as Record<string, unknown>;
  return typeof t.id === 'string' && typeof t.title === 'string';
}

/** Parse and loosely validate an uploaded JSON file, filling in sane defaults for any gaps. */
export function parseImportFile(raw: string): { tasks: Task[]; categories: Category[] } {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new ImportValidationError('That file is not valid JSON.');
  }

  const record = data as Record<string, unknown>;
  const rawTasks = Array.isArray(data) ? data : Array.isArray(record?.tasks) ? record.tasks : null;

  if (!rawTasks) {
    throw new ImportValidationError('No tasks array was found in that file.');
  }

  const tasks: Task[] = rawTasks.filter(isTaskLike).map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description ?? '',
    category: t.category ?? 'personal',
    dueDate: t.dueDate ?? null,
    priority: t.priority ?? 'medium',
    estimatedTime: t.estimatedTime ?? null,
    notes: t.notes ?? '',
    completed: Boolean(t.completed),
    archived: Boolean(t.archived),
    pinned: Boolean(t.pinned),
    favorite: Boolean(t.favorite),
    recurrence: t.recurrence ?? 'none',
    createdAt: t.createdAt ?? new Date().toISOString(),
    updatedAt: t.updatedAt ?? new Date().toISOString(),
    completedAt: t.completedAt ?? null,
  }));

  const categories: Category[] = Array.isArray(record?.categories) ? (record.categories as Category[]) : [];

  if (tasks.length === 0) {
    throw new ImportValidationError('No valid tasks were found in that file.');
  }

  return { tasks, categories };
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new ImportValidationError('Could not read that file.'));
    reader.readAsText(file);
  });
}
