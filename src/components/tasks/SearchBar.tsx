import { FiSearch, FiX } from 'react-icons/fi';
import { useTasks } from '@/hooks/useTasks';

export function SearchBar() {
  const { searchQuery, setSearchQuery, searchInputRef } = useTasks();

  return (
    <div className="relative flex-1">
      <FiSearch
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
        aria-hidden="true"
      />
      <input
        ref={searchInputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tasks by title, description, or category..."
        aria-label="Search tasks"
        className="input-base w-full pl-10 pr-9"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 transition-colors hover:text-ink-500 dark:hover:text-ink-200"
        >
          <FiX aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
