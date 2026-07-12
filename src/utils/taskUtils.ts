import { format, subDays, isSameDay } from 'date-fns';
import type { Category, FilterType, Priority, SortType, Task, TaskStats } from '@/types';
import { PRIORITY_ORDER } from '@/constants/priorities';
import {
  isTaskDueToday,
  isTaskOverdue,
  isTaskUpcoming,
  safeParseISO,
} from './date';

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

  let result = tasks;

  if (filter === 'archived') {
    result = result.filter((t) => t.archived);
  } else {
    result = result.filter((t) => !t.archived);
    switch (filter) {
      case 'pending':
        result = result.filter((t) => !t.completed);
        break;
      case 'completed':
        result = result.filter((t) => t.completed);
        break;
      case 'today':
        result = result.filter((t) => isTaskDueToday(t.dueDate));
        break;
      case 'upcoming':
        result = result.filter((t) => isTaskUpcoming(t.dueDate));
        break;
      case 'overdue':
        result = result.filter((t) => isTaskOverdue(t.dueDate, t.completed));
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
  const completed = active.filter((t) => t.completed).length;
  const pending = total - completed;
  const overdue = active.filter((t) => isTaskOverdue(t.dueDate, t.completed)).length;
  const productivity = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, pending, overdue, productivity };
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
