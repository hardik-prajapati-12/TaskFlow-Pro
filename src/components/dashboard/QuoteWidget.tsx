import { useMemo, useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { MOTIVATIONAL_QUOTES } from '@/constants/quotes';
import { IconButton } from '@/components/ui/IconButton';

export function QuoteWidget() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));
  const quote = useMemo(() => MOTIVATIONAL_QUOTES[index], [index]);

  const shuffle = () => {
    setIndex((prev) => {
      if (MOTIVATIONAL_QUOTES.length <= 1) return prev;
      let next = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
      while (next === prev) next = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
      return next;
    });
  };

  return (
    <div className="glass-card relative overflow-hidden p-5">
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-flow-gradient-soft blur-2xl"
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between gap-2">
        <p className="font-display text-sm italic leading-relaxed text-ink-700 dark:text-ink-200">
          &ldquo;{quote.text}&rdquo;
        </p>
        <IconButton icon={<FiRefreshCw aria-hidden="true" />} label="Show another quote" size="sm" onClick={shuffle} />
      </div>
      <p className="relative mt-2 text-xs font-medium text-ink-400">— {quote.author}</p>
    </div>
  );
}
