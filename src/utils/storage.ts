/**
 * Thin, defensive wrapper around window.localStorage.
 * All reads/writes are try/caught so a corrupt value or private-browsing
 * mode restriction never crashes the app — it just falls back silently.
 */
export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`[storage] Failed to read "${key}"`, error);
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[storage] Failed to write "${key}"`, error);
    return false;
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`[storage] Failed to remove "${key}"`, error);
  }
}
