import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: 'flow' | 'signal' | 'amber' | 'rose';
  delay?: number;
}

const accentClass: Record<NonNullable<StatCardProps['accent']>, string> = {
  flow: 'bg-flow-500/10 text-flow-600 dark:text-flow-300',
  signal: 'bg-signal-500/10 text-signal-600 dark:text-signal-300',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
  rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-300',
};

export function StatCard({ label, value, icon, accent = 'flow', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="glass-card flex items-center gap-4 p-5"
    >
      <div
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl',
          accentClass[accent],
        )}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-display text-2xl font-bold text-ink-900 dark:text-white">{value}</p>
        <p className="truncate text-sm text-ink-400">{label}</p>
      </div>
    </motion.div>
  );
}
