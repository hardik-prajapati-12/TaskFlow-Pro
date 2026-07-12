import { useCallback, useState } from 'react';
import { readStorage, writeStorage } from '@/utils/storage';

type SetValue<T> = (next: T | ((prev: T) => T)) => void;

/**
 * A useState-compatible hook that transparently persists to localStorage
 * on every update. This is what gives TaskFlow Pro its "auto save" behavior —
 * there is no separate save step anywhere in the app.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const [value, setValue] = useState<T>(() => readStorage<T>(key, initialValue));

  const setAndPersist = useCallback<SetValue<T>>(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
        writeStorage(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, setAndPersist];
}
