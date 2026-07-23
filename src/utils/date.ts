import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  isYesterday,
  isPast,
  isFuture,
  isSameDay,
  formatDistanceToNow,
  addDays,
  addWeeks,
  addMonths,
  startOfWeek,
  startOfMonth,
  isWithinInterval,
  endOfDay,
} from 'date-fns';
import type { RecurrenceType } from '@/types';

/** Safely parse a date string (or return null) without throwing on bad input. */
export function safeParseISO(value: string | null | undefined): Date | null {
  if (!value) return null;
  try {
    const parsed = parseISO(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

export function formatFriendlyDate(value: string | null): string {
  const date = safeParseISO(value);
  if (!date) return 'No due date';
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

export function formatFullDate(value: string | null): string {
  const date = safeParseISO(value);
  if (!date) return 'No due date';
  return format(date, 'EEEE, MMMM d, yyyy');
}

export function formatDateTime(value: string | null): string {
  const date = safeParseISO(value);
  if (!date) return '—';
  return format(date, 'MMM d, yyyy · h:mm a');
}

export function formatRelative(value: string | null): string {
  const date = safeParseISO(value);
  if (!date) return '—';
  return `${formatDistanceToNow(date)} ago`;
}

export function isTaskOverdue(dueDate: string | null, completed: boolean): boolean {
  const date = safeParseISO(dueDate);
  if (!date || completed) return false;
  return isPast(endOfDay(date)) && !isToday(date);
}

export function isTaskDueToday(dueDate: string | null): boolean {
  const date = safeParseISO(dueDate);
  if (!date) return false;
  return isToday(date);
}

export function isTaskUpcoming(dueDate: string | null): boolean {
  const date = safeParseISO(dueDate);
  if (!date) return false;
  return isFuture(date) && !isToday(date);
}

export function isSameCalendarDay(a: string | null, b: Date): boolean {
  const date = safeParseISO(a);
  if (!date) return false;
  return isSameDay(date, b);
}

export function isWithinCurrentWeek(value: string | null): boolean {
  const date = safeParseISO(value);
  if (!date) return false;
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  return isWithinInterval(date, { start, end: new Date() }) || isToday(date);
}

export function isWithinCurrentMonth(value: string | null): boolean {
  const date = safeParseISO(value);
  if (!date) return false;
  const start = startOfMonth(new Date());
  return isWithinInterval(date, { start, end: new Date() }) || isToday(date);
}

/** Advance a due date forward by one recurrence interval, preserving time-of-day. */
export function getNextRecurrenceDate(
  currentDueDate: string | null,
  recurrence: RecurrenceType,
): string | null {
  const base = safeParseISO(currentDueDate) ?? new Date();
  switch (recurrence) {
    case 'daily':
      return addDays(base, 1).toISOString();
    case 'weekly':
      return addWeeks(base, 1).toISOString();
    case 'monthly':
      return addMonths(base, 1).toISOString();
    default:
      return currentDueDate;
  }
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Working late';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

export function toDateInputValue(value: string | null): string {
  const date = safeParseISO(value);
  if (!date) return '';
  return format(date, 'yyyy-MM-dd');
}

export function fromDateInputValue(value: string): string | null {
  if (!value) return null;
  const parsed = new Date(`${value}T09:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export function formatMinutesToHours(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return '24 hours (default)';
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'}`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) return `${hours} hr${hours === 1 ? '' : 's'}`;
  return `${hours}h ${remainingMins}m`;
}

export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return 'Time expired';
  const totalSeconds = Math.floor(ms / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  if (minutes > 0) {
    return `${minutes}m remaining`;
  }
  return `${totalSeconds}s remaining`;
}

