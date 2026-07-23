import { format, subDays, isSameDay } from 'date-fns';
import type { Category, FilterType, Priority, SortType, Task, TaskStats } from '@/types';
import { PRIORITY_ORDER } from '@/constants/priorities';
import {
  isTaskDueToday,
  isTaskOverdue,
  isTaskUpcoming,
  safeParseISO,
} from './date';

export interface TerminationInfo {
  isTerminated: boolean;
  reason?: 'estimated_time_exceeded' | 'twenty_four_hours_exceeded' | 'due_date_exceeded' | 'manual';
  deadlineMs?: number;
  timeRemainingMs?: number;
}

/** Check if a task has passed its estimated time or 24-hour limit without completion. */
export function getTaskTerminationStatus(task: Task, nowMs: number = Date.now()): TerminationInfo {
  if (task.completed || task.archived) {
    return { isTerminated: false };
  }

  if (task.terminated) {
    return {
      isTerminated: true,
      reason: task.terminationReason || 'manual',
    };
  }

  const createdAtMs = safeParseISO(task.createdAt)?.getTime() ?? nowMs;

  // Case A: Estimated time is specified (in minutes)
  if (task.estimatedTime && task.estimatedTime > 0) {
    const limitMs = task.estimatedTime * 60 * 1000;
    const deadlineMs = createdAtMs + limitMs;
    const timeRemainingMs = deadlineMs - nowMs;

    if (nowMs >= deadlineMs) {
      return {
        isTerminated: true,
        reason: 'estimated_time_exceeded',
        deadlineMs,
        timeRemainingMs: 0,
      };
    }

    return {
      isTerminated: false,
      deadlineMs,
      timeRemainingMs,
    };
  }

  // Case B: No estimated time specified -> 24 hours (1 day) from creation
  const limitMs = 24 * 60 * 60 * 1000;
  const deadlineMs = createdAtMs + limitMs;
  const timeRemainingMs = deadlineMs - nowMs;

  if (nowMs >= deadlineMs) {
    return {
      isTerminated: true,
      reason: 'twenty_four_hours_exceeded',
      deadlineMs,
      timeRemainingMs: 0,
    };
  }

  return {
    isTerminated: false,
    deadlineMs,
    timeRemainingMs,
  };
}

/** Helper to check if task is completed or effectively terminated */
export function isTerminatedTask(task: Task, nowMs: number = Date.now()): boolean {
  if (task.completed || task.archived) return false;
  return Boolean(task.terminated) || getTaskTerminationStatus(task, nowMs).isTerminated;
}

interface TaskQuery {
  filter: FilterType;
  category: string | null;
  priority: Priority | null;
  search: string;
  favoritesOnly: boolean;
}

/** Apply the active filter, category/priority narrowing, favorites toggle, and search query. */
export function filterTasks(tasks: Task[], query: TaskQuery, categories: Category[]): Task[] {
  const { filter, category, priority, search, favoritesOnly } = query;
  const nowMs = Date.now();

  let result = tasks;

  if (filter === 'archived') {
    result = result.filter((t) => t.archived);
  } else {
    result = result.filter((t) => !t.archived);
    switch (filter) {
      case 'pending':
        result = result.filter((t) => !t.completed && !isTerminatedTask(t, nowMs));
        break;
      case 'completed':
        result = result.filter((t) => t.completed);
        break;
      case 'today':
        result = result.filter((t) => isTaskDueToday(t.dueDate) && !t.completed && !isTerminatedTask(t, nowMs));
        break;
      case 'upcoming':
        result = result.filter((t) => isTaskUpcoming(t.dueDate) && !t.completed && !isTerminatedTask(t, nowMs));
        break;
      case 'overdue':
      case 'terminated':
        result = result.filter((t) => !t.completed && isTerminatedTask(t, nowMs));
        break;
      case 'all':
      default:
        break;
    }
  }

  if (category) {
    result = result.filter((t) => t.category === category);
  }

  if (priority) {
    result = result.filter((t) => t.priority === priority);
  }

  if (favoritesOnly) {
    result = result.filter((t) => t.favorite);
  }

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    const categoryNameById = new Map(categories.map((c) => [c.id, c.name.toLowerCase()]));
    result = result.filter((t) => {
      const categoryName = categoryNameById.get(t.category) ?? '';
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        categoryName.includes(q)
      );
    });
  }

  return result;
}

/** Sort tasks, always floating pinned tasks to the top regardless of sort mode. */
export function sortTasks(tasks: Task[], sort: SortType): Task[] {
  const pinned = tasks.filter((t) => t.pinned);
  const rest = tasks.filter((t) => !t.pinned);

  const comparator = (a: Task, b: Task): number => {
    switch (sort) {
      case 'dueDate': {
        const aTime = safeParseISO(a.dueDate)?.getTime() ?? Infinity;
        const bTime = safeParseISO(b.dueDate)?.getTime() ?? Infinity;
        return aTime - bTime;
      }
      case 'priority':
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'recent':
      default:
        return (safeParseISO(b.createdAt)?.getTime() ?? 0) - (safeParseISO(a.createdAt)?.getTime() ?? 0);
    }
  };

  return [...pinned.sort(comparator), ...rest.sort(comparator)];
}

export function computeStats(tasks: Task[]): TaskStats {
  const active = tasks.filter((t) => !t.archived);
  const total = active.length;
  const nowMs = Date.now();

  const completed = active.filter((t) => t.completed).length;
  const terminated = active.filter((t) => !t.completed && isTerminatedTask(t, nowMs)).length;
  const pending = active.filter((t) => !t.completed && !isTerminatedTask(t, nowMs)).length;
  const overdue = terminated;
  const productivity = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, pending, overdue, terminated, productivity };
}

export interface ChartDatum {
  name: string;
  value: number;
  color: string;
}

export function tasksByCategory(tasks: Task[], categories: Category[]): ChartDatum[] {
  const active = tasks.filter((t) => !t.archived);
  return categories
    .map((c) => ({
      name: c.name,
      value: active.filter((t) => t.category === c.id).length,
      color: c.color,
    }))
    .filter((d) => d.value > 0);
}

export function tasksByPriority(tasks: Task[]): ChartDatum[] {
  const active = tasks.filter((t) => !t.archived);
  return [
    { name: 'High', value: active.filter((t) => t.priority === 'high').length, color: '#EF4444' },
    { name: 'Medium', value: active.filter((t) => t.priority === 'medium').length, color: '#F59E0B' },
    { name: 'Low', value: active.filter((t) => t.priority === 'low').length, color: '#22C55E' },
  ].filter((d) => d.value > 0);
}

export function tasksByStatus(tasks: Task[]): ChartDatum[] {
  const active = tasks.filter((t) => !t.archived);
  const nowMs = Date.now();
  const completed = active.filter((t) => t.completed).length;
  const terminated = active.filter((t) => !t.completed && isTerminatedTask(t, nowMs)).length;
  const pending = active.filter((t) => !t.completed && !isTerminatedTask(t, nowMs)).length;

  return [
    { name: 'Completed', value: completed, color: '#10B981' },
    { name: 'Pending', value: pending, color: '#F59E0B' },
    { name: 'Terminated', value: terminated, color: '#F43F5E' },
  ].filter((d) => d.value > 0);
}

export interface TrendDatum {
  day: string;
  completed: number;
}

/** Completed-task counts for each of the last N days, oldest first. */
export function completionTrend(tasks: Task[], days = 7): TrendDatum[] {
  const today = new Date();
  const result: TrendDatum[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = subDays(today, i);
    const count = tasks.filter((t) => {
      const completedAt = safeParseISO(t.completedAt);
      return completedAt && isSameDay(completedAt, day);
    }).length;
    result.push({ day: format(day, 'EEE'), completed: count });
  }
  return result;
}

export function countCompletedSince(tasks: Task[], since: (d: string | null) => boolean): number {
  return tasks.filter((t) => t.completed && since(t.completedAt)).length;
}

