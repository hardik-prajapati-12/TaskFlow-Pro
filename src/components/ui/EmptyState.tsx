import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-200 px-6 py-16 text-center dark:border-ink-700"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-flow-gradient-soft text-2xl text-flow-600 dark:text-flow-300">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-ink-800 dark:text-white">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-400">{description}</p>}
      {action}
    </motion.div>
  );
}
