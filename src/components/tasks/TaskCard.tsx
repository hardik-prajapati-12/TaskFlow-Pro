import { useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  FiArchive,
  FiCalendar,
  FiCheck,
  FiClock,
  FiCopy,
  FiEdit2,
  FiMoreVertical,
  FiRotateCcw,
  FiStar,
  FiTrash2,
} from 'react-icons/fi';
import { RiPushpin2Fill, RiPushpin2Line } from 'react-icons/ri';
import type { Task } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { Checkbox } from '@/components/ui/Checkbox';
import { IconButton } from '@/components/ui/IconButton';
import { Badge } from '@/components/ui/Badge';
import { CategoryBadge, PriorityBadge } from './Badges';
import { formatFriendlyDate, isTaskOverdue } from '@/utils/date';
import { cn } from '@/utils/cn';

export function TaskCard({ task }: { task: Task }) {
  const {
    getCategory,
    toggleComplete,
    togglePin,
    toggleFavorite,
    toggleArchive,
    deleteTask,
    duplicateTask,
    openEditForm,
    openTaskDetails,
    selectionMode,
    selectedIds,
    toggleSelect,
    requestConfirm,
  } = useTasks();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  const category = getCategory(task.category);
  const overdue = isTaskOverdue(task.dueDate, task.completed);
  const isSelected = selectedIds.includes(task.id);

  const handleDelete = () => {
    setMenuOpen(false);
    requestConfirm({
      title: 'Delete this task?',
      message: `"${task.title}" will be moved to Recently Deleted, where you can restore it any time.`,
      danger: true,
      confirmLabel: 'Delete',
      onConfirm: () => deleteTask(task.id),
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'glass-card group relative flex flex-col gap-3 p-4 transition-shadow duration-200 hover:shadow-soft-lg',
        task.completed && 'opacity-70',
        isSelected && 'ring-2 ring-flow-500',
      )}
    >
      {task.pinned && (
        <span
          className="absolute -left-2 -top-2 flex h-6 w-6 -rotate-[18deg] items-center justify-center rounded-full bg-flow-gradient text-white shadow-soft"
          aria-hidden="true"
        >
          <RiPushpin2Fill className="h-3.5 w-3.5" />
        </span>
      )}

      <div className="flex items-start gap-3">
        {selectionMode && (
          <Checkbox
            checked={isSelected}
            onChange={() => toggleSelect(task.id)}
            aria-label={`Select ${task.title}`}
            className="mt-0.5"
          />
        )}

        <button
          type="button"
          onClick={() => toggleComplete(task.id)}
          aria-pressed={task.completed}
          aria-label={task.completed ? `Mark "${task.title}" as not complete` : `Mark "${task.title}" as complete`}
          className={cn(
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
            task.completed
              ? 'border-transparent bg-flow-gradient text-white'
              : 'border-ink-300 hover:border-flow-500 dark:border-ink-500',
          )}
        >
          {task.completed && <FiCheck className="h-3 w-3" aria-hidden="true" />}
        </button>

        <button
          type="button"
          onClick={() => openTaskDetails(task)}
          className="min-w-0 flex-1 text-left"
        >
          <p
            className={cn(
              'truncate font-medium text-ink-800 dark:text-ink-100',
              task.completed && 'text-ink-400 line-through dark:text-ink-500',
            )}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="mt-0.5 line-clamp-2 text-sm text-ink-400">{task.description}</p>
          )}
        </button>

        <button
          type="button"
          onClick={() => toggleFavorite(task.id)}
          aria-pressed={task.favorite}
          aria-label={task.favorite ? `Remove ${task.title} from favorites` : `Add ${task.title} to favorites`}
          className={cn(
            'shrink-0 text-lg transition-colors',
            task.favorite ? 'text-amber-400' : 'text-ink-200 hover:text-amber-300 dark:text-ink-600',
          )}
        >
          <FiStar className={task.favorite ? 'fill-current' : ''} aria-hidden="true" />
        </button>

        <div className="relative shrink-0" ref={menuRef}>
          <IconButton
            icon={<FiMoreVertical aria-hidden="true" />}
            label={`More actions for ${task.title}`}
            size="sm"
            onClick={() => setMenuOpen((v) => !v)}
          />
          {menuOpen && (
            <div
              role="menu"
              className="glass-panel-solid absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl py-1 text-sm shadow-soft-lg"
            >
              <MenuItem
                icon={<FiEdit2 aria-hidden="true" />}
                label="Edit"
                onClick={() => {
                  openEditForm(task);
                  setMenuOpen(false);
                }}
              />
              <MenuItem
                icon={<FiCopy aria-hidden="true" />}
                label="Duplicate"
                onClick={() => {
                  duplicateTask(task.id);
                  setMenuOpen(false);
                }}
              />
              <MenuItem
                icon={task.pinned ? <RiPushpin2Line aria-hidden="true" /> : <RiPushpin2Fill aria-hidden="true" />}
                label={task.pinned ? 'Unpin' : 'Pin to top'}
                onClick={() => {
                  togglePin(task.id);
                  setMenuOpen(false);
                }}
              />
              <MenuItem
                icon={task.archived ? <FiRotateCcw aria-hidden="true" /> : <FiArchive aria-hidden="true" />}
                label={task.archived ? 'Restore' : 'Archive'}
                onClick={() => {
                  toggleArchive(task.id);
                  setMenuOpen(false);
                }}
              />
              <MenuItem icon={<FiTrash2 aria-hidden="true" />} label="Delete" danger onClick={handleDelete} />
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => openTaskDetails(task)}
        className="flex flex-wrap items-center gap-2 pl-8 text-left"
      >
        <CategoryBadge category={category} />
        <PriorityBadge priority={task.priority} />
        {task.dueDate && (
          <Badge
            className={cn(
              'bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300',
              overdue && 'bg-priority-high/10 text-priority-high dark:bg-priority-high/15',
            )}
            icon={<FiCalendar className="h-3 w-3" aria-hidden="true" />}
          >
            {formatFriendlyDate(task.dueDate)}
          </Badge>
        )}
        {task.estimatedTime && (
          <Badge
            className="bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300"
            icon={<FiClock className="h-3 w-3" aria-hidden="true" />}
          >
            {task.estimatedTime >= 60 ? `${Math.round((task.estimatedTime / 60) * 10) / 10}h` : `${task.estimatedTime}m`}
          </Badge>
        )}
      </button>
    </motion.div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-ink-50 dark:hover:bg-white/5',
        danger ? 'text-priority-high' : 'text-ink-600 dark:text-ink-200',
      )}
    >
      <span className="text-base">{icon}</span>
      {label}
    </button>
  );
}
