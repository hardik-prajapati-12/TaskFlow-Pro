import { useState } from 'react';
import { FiRefreshCw, FiZap } from 'react-icons/fi';
import { PRODUCTIVITY_TIPS } from '@/constants/tips';
import { IconButton } from '@/components/ui/IconButton';

export function TipWidget() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * PRODUCTIVITY_TIPS.length));

  const shuffle = () => {
    setIndex((prev) => {
      if (PRODUCTIVITY_TIPS.length <= 1) return prev;
      let next = Math.floor(Math.random() * PRODUCTIVITY_TIPS.length);
      while (next === prev) next = Math.floor(Math.random() * PRODUCTIVITY_TIPS.length);
      return next;
    });
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-signal-500/10 text-signal-600 dark:text-signal-300">
            <FiZap className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Productivity tip</p>
            <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">{PRODUCTIVITY_TIPS[index]}</p>
          </div>
        </div>
        <IconButton icon={<FiRefreshCw aria-hidden="true" />} label="Show another tip" size="sm" onClick={shuffle} />
      </div>
    </div>
  );
}
