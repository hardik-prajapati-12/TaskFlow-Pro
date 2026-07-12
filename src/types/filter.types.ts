export type FilterType =
  | 'all'
  | 'pending'
  | 'completed'
  | 'archived'
  | 'today'
  | 'upcoming'
  | 'overdue';

export type SortType = 'dueDate' | 'priority' | 'recent' | 'alphabetical';
