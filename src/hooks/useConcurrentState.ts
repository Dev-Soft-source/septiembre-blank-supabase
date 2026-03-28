import { useState, useTransition, useDeferredValue, useCallback, useMemo } from 'react';
import { useStableCallback } from './useStableCallback';

interface ConcurrentStateConfig<T> {
  initialState: T;
  enableTransition?: boolean;
  deferUpdates?: boolean;
}

/**
 * Advanced concurrent state management with React 18 features
 */
export function useConcurrentState<T>(config: ConcurrentStateConfig<T>) {
  const { initialState, enableTransition = true, deferUpdates = false } = config;
  
  const [state, setState] = useState<T>(initialState);
  const [isPending, startTransition] = useTransition();
  
  // Defer expensive computations
  const deferredState = useDeferredValue(state);
  const effectiveState = deferUpdates ? deferredState : state;

  const updateState = useStableCallback((updater: T | ((prev: T) => T)) => {
    if (enableTransition) {
      startTransition(() => {
        setState(updater);
      });
    } else {
      setState(updater);
    }
  });

  const updateStateSync = useStableCallback((updater: T | ((prev: T) => T)) => {
    setState(updater);
  });

  // Batch multiple updates
  const batchUpdates = useStableCallback((updates: Array<(prev: T) => T>) => {
    if (enableTransition) {
      startTransition(() => {
        setState(prev => updates.reduce((acc, update) => update(acc), prev));
      });
    } else {
      setState(prev => updates.reduce((acc, update) => update(acc), prev));
    }
  });

  const reset = useStableCallback(() => {
    updateState(initialState);
  });

  return {
    state: effectiveState,
    updateState,
    updateStateSync,
    batchUpdates,
    reset,
    isPending,
    isDeferred: deferUpdates && state !== deferredState
  };
}

/**
 * Concurrent search with debouncing and cancellation
 */
export function useConcurrentSearch<T>(
  searchFn: (query: string, signal: AbortSignal) => Promise<T[]>,
  debounceMs = 300
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  // Track abort controllers for cleanup
  const abortControllerRef = useState(() => new Map<string, AbortController>())[0];

  const executeSearch = useStableCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    // Cancel previous search
    const previousController = abortControllerRef.get(searchQuery);
    if (previousController) {
      previousController.abort();
    }

    const controller = new AbortController();
    abortControllerRef.set(searchQuery, controller);

    setIsSearching(true);
    setError(null);

    try {
      const searchResults = await searchFn(searchQuery, controller.signal);
      
      if (!controller.signal.aborted) {
        startTransition(() => {
          setResults(searchResults);
          setIsSearching(false);
        });
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setIsSearching(false);
      }
    } finally {
      abortControllerRef.delete(searchQuery);
    }
  });

  // Debounced search effect
  useState(() => {
    const timer = setTimeout(() => {
      executeSearch(deferredQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  });

  const clearSearch = useStableCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    // Cancel all ongoing searches
    abortControllerRef.forEach(controller => controller.abort());
    abortControllerRef.clear();
  });

  return {
    query,
    setQuery,
    results,
    isSearching: isSearching || isPending,
    error,
    clearSearch,
    executeSearch: () => executeSearch(query)
  };
}