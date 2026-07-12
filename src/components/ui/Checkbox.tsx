import { forwardRef, type InputHTMLAttributes } from 'react';
import { FiCheck } from 'react-icons/fi';
import { cn } from '@/utils/cn';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, label, id, name, ...props },
  ref,
) {
  const checkboxId = id ?? name;
  return (
    <label
      htmlFor={checkboxId}
      className={cn('group inline-flex cursor-pointer select-none items-center gap-2', className)}
    >
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          ref={ref}
          id={checkboxId}
          name={name}
          type="checkbox"
          className="peer absolute inset-0 z-10 h-5 w-5 cursor-pointer opacity-0"
          {...props}
        />
        <span className="pointer-events-none absolute inset-0 rounded-md border-2 border-ink-300 bg-white transition-colors peer-checked:border-transparent peer-checked:bg-flow-gradient peer-focus-visible:ring-2 peer-focus-visible:ring-flow-500 peer-focus-visible:ring-offset-2 dark:border-ink-500 dark:bg-ink-800" />
        <FiCheck className="pointer-events-none absolute inset-0 m-auto h-3.5 w-3.5 scale-0 text-white transition-transform peer-checked:scale-100" />
      </span>
      {label && <span className="text-sm text-ink-600 dark:text-ink-300">{label}</span>}
    </label>
  );
});
