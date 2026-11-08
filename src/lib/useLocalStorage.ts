import { useState, useEffect, useCallback } from 'react';

const NAMESPACE = 'fedlifecycle:v1';

function makeKey(key: string): string {
  return `${NAMESPACE}:${key}`;
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(makeKey(key));
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(makeKey(key), JSON.stringify(value));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (updater: (prev: T) => T) => void] {
  const [value, setValue] = useState<T>(() => readStorage(key, initialValue));

  useEffect(() => {
    writeStorage(key, value);
  }, [key, value]);

  const update = useCallback((updater: (prev: T) => T) => {
    setValue((prev) => {
      const next = updater(prev);
      return next;
    });
  }, []);

  return [value, update];
}

/** Read a set of checked IDs from localStorage */
export function useCheckedSet(storageKey: string): [Set<string>, (id: string) => void, (ids: Set<string>) => void] {
  const [checkedIds, setCheckedIds] = useLocalStorage<string[]>(storageKey, []);

  const checkedSet = new Set(checkedIds);

  const toggle = useCallback((id: string) => {
    setCheckedIds((prev) => {
      const set = new Set(prev);
      if (set.has(id)) {
        set.delete(id);
      } else {
        set.add(id);
      }
      return Array.from(set);
    });
  }, [setCheckedIds]);

  const setAll = useCallback((ids: Set<string>) => {
    setCheckedIds(() => Array.from(ids));
  }, [setCheckedIds]);

  return [checkedSet, toggle, setAll];
}
