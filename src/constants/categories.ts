import type { Category } from '@/types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'personal', name: 'Personal', color: '#6366F1', isDefault: true },
  { id: 'work', name: 'Work', color: '#0EA5A0', isDefault: true },
  { id: 'study', name: 'Study', color: '#8B5CF6', isDefault: true },
  { id: 'health', name: 'Health', color: '#22C55E', isDefault: true },
  { id: 'shopping', name: 'Shopping', color: '#EC4899', isDefault: true },
  { id: 'finance', name: 'Finance', color: '#F59E0B', isDefault: true },
  { id: 'travel', name: 'Travel', color: '#0EA5E9', isDefault: true },
];

export const CATEGORY_COLOR_SWATCHES = [
  '#6366F1', '#0EA5A0', '#8B5CF6', '#22C55E', '#EC4899',
  '#F59E0B', '#0EA5E9', '#EF4444', '#14B8A6', '#F43F5E',
];
