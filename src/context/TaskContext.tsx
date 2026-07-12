import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import type {
  Category,
  ConfirmOptions,
  ConfirmState,
  DeletedTask,
  FilterType,
  Goals,
  Priority,
  SortType,
  Task,
  TaskFormValues,
  TaskStats,
} from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useDebounce } from '@/hooks/useDebounce';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import { generateId } from '@/utils/id';
import {
  downloadTasksAsJson,
  ImportValidationError,
  parseImportFile,
  readFileAsText,
} from '@/utils/exportImport';
import { computeStats, filterTasks, sortTasks } from '@/utils/taskUtils';
import {
  applyTaskUpdate,
  buildTaskInput,
  createTask,
  duplicateTask as duplicateTaskEntity,
  moveTaskToTrash,
  restoreTaskFromTrash,
  toggleTaskCompletion,
} from '@/services/taskService';
import { notify } from '@/utils/toast';

const DEFAULT_GOALS: Goals = { daily: 3, weekly: 15, monthly: 60 };

export interface TaskFormState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  task?: Task;
}

export interface TaskContextValue {
  // Raw data
  tasks: Task[];
  categories: Category[];
  trash: DeletedTask[];
  goals: Goals;

  // Derived data
  filteredTasks: Task[];
  stats: TaskStats;
  pinnedTasks: Task[];
  getCategory: (id: string) => Category;

  // Filter / sort / search state
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  categoryFilter: string | null;
  setCategoryFilter: (id: string | null) => void;
  priorityFilter: Priority | null;
  setPriorityFilter: (priority: Priority | null) => void;
  sort: SortType;
  setSort: (sort: SortType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (value: boolean) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  resetFilters: () => void;

  // Selection
  selectionMode: boolean;
  toggleSelectionMode: () => void;
  selectedIds: string[];
  toggleSelect: (id: string) => void;
  selectAllVisible: () => void;
  clearSelection: () => void;

  // Task CRUD
  addTask: (values: TaskFormValues) => void;
  updateTask: (id: string, values: TaskFormValues) => void;
  deleteTask: (id: string) => void;
  restoreFromTrash: (id: string) => void;
  permanentlyDelete: (id: string) => void;
  emptyTrash: () => void;
  duplicateTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  toggleArchive: (id: string) => void;
  togglePin: (id: string) => void;
  toggleFavorite: (id: string) => void;

  // Bulk actions
  bulkComplete: () => void;
  bulkArchive: () => void;
  bulkRestore: () => void;
  bulkDelete: () => void;

  // Categories
  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string) => void;

  // Settings
  updateGoals: (goals: Goals) => void;
  exportData: () => void;
  importData: (file: File) => Promise<void>;
  resetAllData: () => void;

  // Modals
  formState: TaskFormState;
  openCreateForm: () => void;
  openEditForm: (task: Task) => void;
  closeForm: () => void;
  viewingTask: Task | null;
  isTaskDetailsOpen: boolean;
  openTaskDetails: (task: Task) => void;
  closeTaskDetails: () => void;
  confirmState: ConfirmState | null;
  requestConfirm: (options: ConfirmOptions) => void;
  closeConfirm: () => void;
}

export const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEYS.TASKS, []);
  const [categories, setCategories] = useLocalStorage<Category[]>(
    STORAGE_KEYS.CATEGORIES,
    DEFAULT_CATEGORIES,
  );
  const [trash, setTrash] = useLocalStorage<DeletedTask[]>(STORAGE_KEYS.TRASH, []);
  const [goals, setGoals] = useLocalStorage<Goals>(STORAGE_KEYS.GOALS, DEFAULT_GOALS);

  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null);
  const [sort, setSort] = useState<SortType>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 250);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [formState, setFormState] = useState<TaskFormState>({ isOpen: false, mode: 'create' });
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const getCategory = useCallback(
    (id: string): Category => categoryMap.get(id) ?? categories[0] ?? DEFAULT_CATEGORIES[0],
    [categoryMap, categories],
  );

  const filteredTasks = useMemo(
    () =>
      sortTasks(
        filterTasks(
          tasks,
          {
            filter,
            category: categoryFilter,
            priority: priorityFilter,
            search: debouncedSearchQuery,
            favoritesOnly,
          },
          categories,
        ),
        sort,
      ),
    [tasks, filter, categoryFilter, priorityFilter, debouncedSearchQuery, favoritesOnly, sort, categories],
  );

  const stats = useMemo(() => computeStats(tasks), [tasks]);
  const pinnedTasks = useMemo(() => tasks.filter((t) => t.pinned && !t.archived), [tasks]);

  const resetFilters = useCallback(() => {
    setFilter('all');
    setCategoryFilter(null);
    setPriorityFilter(null);
    setFavoritesOnly(false);
    setSearchQuery('');
  }, []);

  // ---- Selection -----------------------------------------------------

  const toggleSelectionMode = useCallback(() => {
    setSelectionMode((prev) => {
      if (prev) setSelectedIds([]);
      return !prev;
    });
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectionMode(true);
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const selectAllVisible = useCallback(() => {
    setSelectionMode(true);
    setSelectedIds(filteredTasks.map((t) => t.id));
  }, [filteredTasks]);

  const clearSelection = useCallback(() => setSelectedIds([]), []);

  // ---- Modals ----------------------------------------------------------

  const openCreateForm = useCallback(() => setFormState({ isOpen: true, mode: 'create' }), []);
  const openEditForm = useCallback(
    (task: Task) => setFormState({ isOpen: true, mode: 'edit', task }),
    [],
  );
  const closeForm = useCallback(() => setFormState((prev) => ({ ...prev, isOpen: false })), []);

  const openTaskDetails = useCallback((task: Task) => {
    setViewingTask(task);
    setIsTaskDetailsOpen(true);
  }, []);
  const closeTaskDetails = useCallback(() => setIsTaskDetailsOpen(false), []);

  const requestConfirm = useCallback(
    (options: ConfirmOptions) => setConfirmState({ ...options, isOpen: true }),
    [],
  );
  const closeConfirm = useCallback(
    () => setConfirmState((prev) => (prev ? { ...prev, isOpen: false } : null)),
    [],
  );

  // ---- Task CRUD ---------------------------------------------------------

  const addTask = useCallback(
    (values: TaskFormValues) => {
      const task = createTask(buildTaskInput(values));
      setTasks((prev) => [task, ...prev]);
      notify.taskAdded(task.title);
      closeForm();
    },
    [setTasks, closeForm],
  );

  const updateTask = useCallback(
    (id: string, values: TaskFormValues) => {
      const input = buildTaskInput(values);
      setTasks((prev) => prev.map((t) => (t.id === id ? applyTaskUpdate(t, input) : t)));
      notify.taskUpdated(input.title);
      closeForm();
    },
    [setTasks, closeForm],
  );

  const deleteTask = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      setTrash((prev) => [moveTaskToTrash(task), ...prev]);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      notify.taskDeleted(task.title);
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    },
    [tasks, setTasks, setTrash],
  );

  const restoreFromTrash = useCallback(
    (id: string) => {
      const deleted = trash.find((t) => t.id === id);
      if (!deleted) return;
      setTasks((prev) => [restoreTaskFromTrash(deleted), ...prev]);
      setTrash((prev) => prev.filter((t) => t.id !== id));
      notify.taskRestored(deleted.title);
    },
    [trash, setTasks, setTrash],
  );

  const permanentlyDelete = useCallback(
    (id: string) => {
      setTrash((prev) => prev.filter((t) => t.id !== id));
    },
    [setTrash],
  );

  const emptyTrash = useCallback(() => {
    setTrash([]);
    notify.trashEmptied();
  }, [setTrash]);

  const duplicateTask = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const copy = duplicateTaskEntity(task);
      setTasks((prev) => [copy, ...prev]);
      notify.taskDuplicated(task.title);
    },
    [tasks, setTasks],
  );

  const toggleComplete = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const { updated, nextOccurrence, removeOccurrenceId } = toggleTaskCompletion(task);
      setTasks((prev) => {
        let next = prev.map((t) => (t.id === id ? updated : t));
        if (nextOccurrence) {
          next = [nextOccurrence, ...next];
        }
        if (removeOccurrenceId) {
          next = next.filter((t) => t.id !== removeOccurrenceId || t.completed);
        }
        return next;
      });
      if (updated.completed) {
        notify.taskCompleted(updated.title);
        if (nextOccurrence) notify.recurringCreated(updated.title);
      } else {
        notify.taskReopened(updated.title);
      }
    },
    [tasks, setTasks],
  );

  const toggleArchive = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const archived = !task.archived;
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, archived, updatedAt: new Date().toISOString() } : t)),
      );
      if (archived) notify.taskArchived(task.title);
      else notify.taskRestored(task.title);
    },
    [tasks, setTasks],
  );

  const togglePin = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const pinned = !task.pinned;
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, pinned } : t)));
      notify.taskPinned(pinned);
    },
    [tasks, setTasks],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const favorite = !task.favorite;
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, favorite } : t)));
      notify.taskFavorited(favorite);
    },
    [tasks, setTasks],
  );

  // ---- Bulk actions --------------------------------------------------------

  const bulkComplete = useCallback(() => {
    const additions: Task[] = [];
    const count = selectedIds.length;
    setTasks((prev) => {
      const next = prev.map((t) => {
        if (!selectedIds.includes(t.id) || t.completed) return t;
        const { updated, nextOccurrence } = toggleTaskCompletion(t);
        if (nextOccurrence) additions.push(nextOccurrence);
        return updated;
      });
      return [...additions, ...next];
    });
    notify.bulkAction(count, 'Completed');
    clearSelection();
  }, [selectedIds, setTasks, clearSelection]);

  const bulkArchive = useCallback(() => {
    const count = selectedIds.length;
    setTasks((prev) =>
      prev.map((t) =>
        selectedIds.includes(t.id) ? { ...t, archived: true, updatedAt: new Date().toISOString() } : t,
      ),
    );
    notify.bulkAction(count, 'Archived');
    clearSelection();
  }, [selectedIds, setTasks, clearSelection]);

  const bulkRestore = useCallback(() => {
    const count = selectedIds.length;
    setTasks((prev) =>
      prev.map((t) =>
        selectedIds.includes(t.id) ? { ...t, archived: false, updatedAt: new Date().toISOString() } : t,
      ),
    );
    notify.bulkAction(count, 'Restored');
    clearSelection();
  }, [selectedIds, setTasks, clearSelection]);

  const bulkDelete = useCallback(() => {
    const count = selectedIds.length;
    const toTrash = tasks.filter((t) => selectedIds.includes(t.id)).map(moveTaskToTrash);
    setTrash((prev) => [...toTrash, ...prev]);
    setTasks((prev) => prev.filter((t) => !selectedIds.includes(t.id)));
    notify.bulkAction(count, 'Deleted');
    clearSelection();
  }, [selectedIds, tasks, setTasks, setTrash, clearSelection]);

  // ---- Categories --------------------------------------------------------

  const addCategory = useCallback(
    (name: string, color: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      setCategories((prev) => [...prev, { id: generateId(), name: trimmed, color, isDefault: false }]);
      notify.categoryAdded(trimmed);
    },
    [setCategories],
  );

  const deleteCategory = useCallback(
    (id: string) => {
      if (categories.length <= 1) {
        notify.error('You must keep at least one category.');
        return;
      }
      const category = categories.find((c) => c.id === id);
      if (!category) return;

      const remaining = categories.filter((c) => c.id !== id);
      const fallback = remaining[0];

      setCategories(remaining);
      setTasks((prev) =>
        prev.map((t) => (t.category === id ? { ...t, category: fallback.id } : t)),
      );
      notify.categoryDeleted(category.name);
    },
    [categories, setCategories, setTasks],
  );

  // ---- Settings / data management -----------------------------------------

  const updateGoals = useCallback(
    (next: Goals) => {
      setGoals(next);
    },
    [setGoals],
  );

  const exportData = useCallback(() => {
    downloadTasksAsJson(tasks, categories, goals);
    notify.dataExported();
  }, [tasks, categories, goals]);

  const importData = useCallback(
    async (file: File) => {
      try {
        const raw = await readFileAsText(file);
        const { tasks: importedTasks, categories: importedCategories } = parseImportFile(raw);
        const remapped = importedTasks.map((t) => ({ ...t, id: generateId() }));
        setTasks((prev) => [...remapped, ...prev]);
        if (importedCategories.length) {
          setCategories((prev) => {
            const existingNames = new Set(prev.map((c) => c.name.toLowerCase()));
            const additions = importedCategories
              .filter((c) => !existingNames.has(c.name.toLowerCase()))
              .map((c) => ({ ...c, id: generateId(), isDefault: false }));
            return [...prev, ...additions];
          });
        }
        notify.dataImported(remapped.length);
      } catch (error) {
        notify.error(error instanceof ImportValidationError ? error.message : 'Import failed.');
      }
    },
    [setTasks, setCategories],
  );

  const resetAllData = useCallback(() => {
    setTasks([]);
    setCategories(DEFAULT_CATEGORIES);
    setTrash([]);
    setGoals(DEFAULT_GOALS);
    resetFilters();
    clearSelection();
    notify.dataReset();
  }, [setTasks, setCategories, setTrash, setGoals, resetFilters, clearSelection]);

  const value: TaskContextValue = {
    tasks,
    categories,
    trash,
    goals,
    filteredTasks,
    stats,
    pinnedTasks,
    getCategory,
    filter,
    setFilter,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    sort,
    setSort,
    searchQuery,
    setSearchQuery,
    favoritesOnly,
    setFavoritesOnly,
    searchInputRef,
    resetFilters,
    selectionMode,
    toggleSelectionMode,
    selectedIds,
    toggleSelect,
    selectAllVisible,
    clearSelection,
    addTask,
    updateTask,
    deleteTask,
    restoreFromTrash,
    permanentlyDelete,
    emptyTrash,
    duplicateTask,
    toggleComplete,
    toggleArchive,
    togglePin,
    toggleFavorite,
    bulkComplete,
    bulkArchive,
    bulkRestore,
    bulkDelete,
    addCategory,
    deleteCategory,
    updateGoals,
    exportData,
    importData,
    resetAllData,
    formState,
    openCreateForm,
    openEditForm,
    closeForm,
    viewingTask,
    isTaskDetailsOpen,
    openTaskDetails,
    closeTaskDetails,
    confirmState,
    requestConfirm,
    closeConfirm,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
