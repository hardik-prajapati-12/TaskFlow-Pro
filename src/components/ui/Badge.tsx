import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  icon?: ReactNode;
}

export function Badge({ children, className, style, icon }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium',
        className,
      )}
      style={style}
    >
      {icon}
      {children}
    </span>
  );
}
