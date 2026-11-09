import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react';

// ---- Types ----

interface ChecklistState {
  [storageKey: string]: string[];
}

type Action =
  | { type: 'TOGGLE'; storageKey: string; id: string }
  | { type: 'SET_ALL'; storageKey: string; ids: string[] }
  | { type: 'HYDRATE'; storageKey: string; ids: string[] };

// ---- Constants ----

const NAMESPACE = 'fedlifecycle:v1';

function makeKey(key: string): string {
  return `${NAMESPACE}:${key}`;
}

function readStorage(key: string): string[] {
  try {
    const raw = localStorage.getItem(makeKey(key));
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(key: string, value: string[]): void {
  try {
    localStorage.setItem(makeKey(key), JSON.stringify(value));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

// ---- Reducer ----

function reducer(state: ChecklistState, action: Action): ChecklistState {
  switch (action.type) {
    case 'TOGGLE': {
      const current = state[action.storageKey] ?? [];
      const set = new Set(current);
      if (set.has(action.id)) {
        set.delete(action.id);
      } else {
        set.add(action.id);
      }
      const next = Array.from(set);
      writeStorage(action.storageKey, next);
      return { ...state, [action.storageKey]: next };
    }
    case 'SET_ALL': {
      writeStorage(action.storageKey, action.ids);
      return { ...state, [action.storageKey]: action.ids };
    }
    case 'HYDRATE': {
      return { ...state, [action.storageKey]: action.ids };
    }
    default:
      return state;
  }
}

// ---- Context ----

interface ChecklistContextValue {
  state: ChecklistState;
  dispatch: React.Dispatch<Action>;
}

const ChecklistContext = createContext<ChecklistContextValue | null>(null);

// ---- Provider ----

export function ChecklistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {}, () => {
    // Lazy init: read all known keys from localStorage
    const initial: ChecklistState = {};
    return initial;
  });

  // Listen for storage events from other tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key && e.key.startsWith(makeKey(''))) {
        const storageKey = e.key.slice(makeKey('').length);
        try {
          const ids = e.newValue ? JSON.parse(e.newValue) : [];
          if (Array.isArray(ids)) {
            dispatch({ type: 'HYDRATE', storageKey, ids });
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <ChecklistContext.Provider value={{ state, dispatch }}>
      {children}
    </ChecklistContext.Provider>
  );
}

// ---- Hooks ----

function useChecklistContext(): ChecklistContextValue {
  const ctx = useContext(ChecklistContext);
  if (!ctx) {
    throw new Error('useChecklistContext must be used within ChecklistProvider');
  }
  return ctx;
}

/**
 * Hook to manage a set of checked IDs for a given storage key.
 * All components using the same storageKey share the same state.
 */
export function useCheckedSet(storageKey: string): [Set<string>, (id: string) => void, (ids: Set<string>) => void] {
  const { state, dispatch } = useChecklistContext();

  // Hydrate from localStorage on mount if not yet in state
  useEffect(() => {
    if (state[storageKey] === undefined) {
      const fromStorage = readStorage(storageKey);
      dispatch({ type: 'HYDRATE', storageKey, ids: fromStorage });
    }
  }, [storageKey, state, dispatch]);

  const ids = state[storageKey] ?? [];
  const checkedSet = new Set(ids);

  const toggle = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE', storageKey, id });
  }, [dispatch, storageKey]);

  const setAll = useCallback((newIds: Set<string>) => {
    dispatch({ type: 'SET_ALL', storageKey, ids: Array.from(newIds) });
  }, [dispatch, storageKey]);

  return [checkedSet, toggle, setAll];
}

/**
 * Hook to read the count of checked items for a given storage key.
 * Useful for sidebar/progress indicators that need real-time counts.
 */
export function useCheckedCount(storageKey: string): number {
  const { state } = useChecklistContext();
  const ids = state[storageKey];
  if (ids === undefined) {
    // Not yet hydrated — read from storage
    const fromStorage = readStorage(storageKey);
    return fromStorage.length;
  }
  return ids.length;
}
