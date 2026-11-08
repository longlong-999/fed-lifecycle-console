import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useLocalStorage, useCheckedSet } from '../lib/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when no stored data', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    act(() => {
      result.current[1](() => 'updated');
    });
    expect(result.current[0]).toBe('updated');
    const stored = localStorage.getItem('fedlifecycle:v1:test-key');
    expect(stored).toBe('"updated"');
  });

  it('reads existing value from localStorage', () => {
    localStorage.setItem('fedlifecycle:v1:existing', '"stored-value"');
    const { result } = renderHook(() => useLocalStorage('existing', 'default'));
    expect(result.current[0]).toBe('stored-value');
  });
});

describe('useCheckedSet', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with empty set', () => {
    const { result } = renderHook(() => useCheckedSet('checklist'));
    const [checkedSet] = result.current;
    expect(checkedSet.size).toBe(0);
  });

  it('toggles items on and off', () => {
    const { result } = renderHook(() => useCheckedSet('checklist'));

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
    const { result, rerender } = renderHook(() => useCheckedSet('checklist'));

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
