import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'ghost' | 'secondary' | 'primary' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  variant?: Variant;
  size?: Size;
  active?: boolean;
}

const sizeClass: Record<Size, string> = {
  sm: 'h-8 w-8 text-base',
  md: 'h-10 w-10 text-lg',
  lg: 'h-12 w-12 text-xl',
};

const variantClass: Record<Variant, string> = {
  ghost: 'btn-ghost',
  secondary: 'btn-secondary',
  primary: 'btn-primary',
  danger: 'btn-danger',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, variant = 'ghost', size = 'md', active, className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-xl',
        variantClass[variant],
        sizeClass[size],
        active && 'bg-flow-500/10 text-flow-600 dark:bg-white/10 dark:text-flow-300',
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
});
