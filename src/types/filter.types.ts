export type FilterType =
  | 'all'
  | 'pending'
  | 'completed'
  | 'archived'
  | 'today'
  | 'upcoming'
  | 'overdue'
  | 'terminated';

export type SortType = 'dueDate' | 'priority' | 'recent' | 'alphabetical';
