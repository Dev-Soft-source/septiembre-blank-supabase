import { useCallback, useRef } from 'react';

/**
 * Advanced callback memoization that prevents unnecessary re-renders
 * while ensuring the callback always has access to the latest values
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    ((...args: Parameters<T>) => callbackRef.current(...args)) as T,
    []
  );
}

/**
 * Memoization hook for expensive computations with dependency tracking
 */
export function useStableMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  isEqual?: (a: T, b: T) => boolean
): T {
  const prevDepsRef = useRef<React.DependencyList>();
  const prevResultRef = useRef<T>();

  const depsChanged = !prevDepsRef.current || 
    deps.some((dep, index) => dep !== prevDepsRef.current![index]);

  if (depsChanged) {
    const newResult = factory();
    
    if (!prevResultRef.current || 
        !isEqual || 
        !isEqual(prevResultRef.current, newResult)) {
      prevResultRef.current = newResult;
    }
    
    prevDepsRef.current = deps;
  }

  return prevResultRef.current!;
}