import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface ProgressBarProps {
  value: number;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
  label?: string;
}

export function ProgressBar({ value, className, trackClassName, barClassName, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn('w-full', className)}>
      <div
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
        className={cn('h-2.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700', trackClassName)}
      >
        <motion.div
          className={cn('h-full rounded-full bg-flow-gradient', barClassName)}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
