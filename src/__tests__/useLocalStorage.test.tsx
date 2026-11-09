import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { useCheckedSet, useCheckedCount, ChecklistProvider } from '../lib/useLocalStorage';

function Wrapper({ children }: { children: ReactNode }) {
  return <ChecklistProvider>{children}</ChecklistProvider>;
}

describe('useCheckedSet', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with empty set', () => {
    const { result } = renderHook(() => useCheckedSet('checklist'), { wrapper: Wrapper });
    const [checkedSet] = result.current;
    expect(checkedSet.size).toBe(0);
  });

  it('toggles items on and off', () => {
    const { result } = renderHook(() => useCheckedSet('checklist'), { wrapper: Wrapper });

    act(() => {
      result.current[1]('item-1');
    });
    expect(result.current[0].has('item-1')).toBe(true);

    act(() => {
      result.current[1]('item-1');
    });
    expect(result.current[0].has('item-1')).toBe(false);
  });

  it('persists checked state across renders', () => {
    const { result, rerender } = renderHook(() => useCheckedSet('checklist'), { wrapper: Wrapper });

    act(() => {
      result.current[1]('item-a');
      result.current[1]('item-b');
    });

    rerender();

    expect(result.current[0].has('item-a')).toBe(true);
    expect(result.current[0].has('item-b')).toBe(true);
    expect(result.current[0].size).toBe(2);
  });
});

describe('useCheckedCount', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns 0 for empty checklist', () => {
    const { result } = renderHook(() => useCheckedCount('mylist'), { wrapper: Wrapper });
    expect(result.current).toBe(0);
  });

  it('reflects count after toggling', () => {
    const { result } = renderHook(() => {
      const [, toggle] = useCheckedSet('mylist');
      const count = useCheckedCount('mylist');
      return { toggle, count };
    }, { wrapper: Wrapper });

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.toggle('a');
    });
    expect(result.current.count).toBe(1);

    act(() => {
      result.current.toggle('b');
    });
    expect(result.current.count).toBe(2);

    act(() => {
      result.current.toggle('a');
    });
    expect(result.current.count).toBe(1);
  });
});
