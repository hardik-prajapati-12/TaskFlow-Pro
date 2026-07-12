import { FiCheckSquare, FiStar } from 'react-icons/fi';
import type { FilterType, Priority, SortType } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import { Select } from '@/components/ui/Select';
import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/utils/cn';

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'today', label: 'Today' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'archived', label: 'Archived' },
];

const SORTS: { value: SortType; label: string }[] = [
  { value: 'recent', label: 'Recently added' },
  { value: 'dueDate', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
  { value: 'alphabetical', label: 'Alphabetical' },
];

export function FilterBar() {
  const {
    filter,
    setFilter,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    sort,
    setSort,
    favoritesOnly,
    setFavoritesOnly,
    categories,
    selectionMode,
    toggleSelectionMode,
  } = useTasks();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter tasks">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
              filter === f.value
                ? 'bg-flow-gradient text-white shadow-glow'
                : 'bg-white/70 text-ink-500 hover:bg-white dark:bg-ink-800/60 dark:text-ink-300 dark:hover:bg-ink-800',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          aria-label="Filter by category"
          value={categoryFilter ?? ''}
          onChange={(e) => setCategoryFilter(e.target.value || null)}
          className="w-auto min-w-[9rem]"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        <Select
          aria-label="Filter by priority"
          value={priorityFilter ?? ''}
          onChange={(e) => setPriorityFilter(e.target.value ? (e.target.value as Priority) : null)}
          className="w-auto min-w-[8rem]"
        >
          <option value="">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>

        <Select
          aria-label="Sort tasks"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortType)}
          className="w-auto min-w-[9.5rem]"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              Sort: {s.label}
            </option>
          ))}
        </Select>

        <IconButton
          icon={<FiStar className={favoritesOnly ? 'fill-current' : ''} aria-hidden="true" />}
          label={favoritesOnly ? 'Show all tasks' : 'Show favorites only'}
          active={favoritesOnly}
          onClick={() => setFavoritesOnly(!favoritesOnly)}
        />

        <IconButton
          icon={<FiCheckSquare aria-hidden="true" />}
          label={selectionMode ? 'Exit selection mode' : 'Select multiple tasks'}
          active={selectionMode}
          onClick={toggleSelectionMode}
          className="ml-auto"
        />
      </div>
    </div>
  );
}
