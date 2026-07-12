import { FiMonitor, FiMoon, FiSun } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { useTheme } from '@/hooks/useTheme';
import type { ThemeMode } from '@/types';
import { cn } from '@/utils/cn';

const OPTIONS: { value: ThemeMode; icon: IconType; label: string }[] = [
  { value: 'light', icon: FiSun, label: 'Light theme' },
  { value: 'dark', icon: FiMoon, label: 'Dark theme' },
  { value: 'system', icon: FiMonitor, label: 'Match system theme' },
];

export function ThemeSwitcher() {
  const { mode, setMode } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="flex items-center gap-0.5 rounded-xl bg-ink-100/70 p-1 dark:bg-ink-800/70"
    >
      {OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={mode === value}
          title={label}
          aria-label={label}
          onClick={() => setMode(value)}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors',
            mode === value
              ? 'bg-white text-flow-600 shadow-soft dark:bg-ink-700 dark:text-flow-300'
              : 'text-ink-400 hover:text-ink-600 dark:hover:text-ink-200',
          )}
        >
          <Icon aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
