import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiBarChart2, FiCalendar, FiCheckSquare, FiGrid, FiSettings } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { cn } from '@/utils/cn';

const NAV_ITEMS: { to: string; label: string; icon: IconType; end?: boolean }[] = [
  { to: '/', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/tasks', label: 'Tasks', icon: FiCheckSquare },
  { to: '/calendar', label: 'Calendar', icon: FiCalendar },
  { to: '/statistics', label: 'Statistics', icon: FiBarChart2 },
  { to: '/settings', label: 'Settings', icon: FiSettings },
];

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink-950/50 backdrop-blur-sm md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-ink-100/80 bg-white/90 px-4 py-6 backdrop-blur-xl transition-transform duration-300 ease-out dark:border-ink-700/60 dark:bg-ink-900/80',
          'md:static md:translate-x-0 md:bg-white/60 dark:md:bg-ink-900/40',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-8 flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-flow-gradient text-white shadow-glow">
            <FiCheckSquare className="h-4 w-4" aria-hidden="true" />
          </div>
          <p className="font-display text-base font-bold leading-tight text-ink-900 dark:text-white">
            Doc<span className="text-gradient-flow">Vault</span>
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-flow-gradient text-white shadow-glow'
                    : 'text-ink-500 hover:bg-ink-100/70 dark:text-ink-300 dark:hover:bg-white/5',
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-1 px-2 pt-4">
          <p className="text-xs text-ink-300 dark:text-ink-600">DocVault v1.0.0</p>
        </div>
      </aside>
    </>
  );
}
