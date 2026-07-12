export type Priority = 'low' | 'medium' | 'high';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  dueDate: string | null;
  priority: Priority;
  estimatedTime: number | null;
  notes: string;
  completed: boolean;
  archived: boolean;
  pinned: boolean;
  favorite: boolean;
  recurrence: RecurrenceType;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  nextOccurrenceId?: string;
}

export interface DeletedTask extends Task {
  deletedAt: string;
}

/** Normalized, typed task fields produced once a raw form submission is parsed. */
export interface TaskInput {
  title: string;
  description: string;
  category: string;
  dueDate: string | null;
  priority: Priority;
  estimatedTime: number | null;
  notes: string;
  recurrence: RecurrenceType;
}

export interface TaskFormValues {
  title: string;
  description: string;
  category: string;
  dueDate: string;
  priority: Priority;
  estimatedTime: string;
  notes: string;
  recurrence: RecurrenceType;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  productivity: number;
}
