import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { cn } from '@/utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, error, children, ...props },
  ref,
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'input-base cursor-pointer appearance-none pr-9',
          error && 'border-priority-high focus:border-priority-high',
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      >
        {children}
      </select>
      <FiChevronDown
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
        aria-hidden="true"
      />
    </div>
  );
});
