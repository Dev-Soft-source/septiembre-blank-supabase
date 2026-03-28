import React from 'react';
import { AsyncState, FormState, isAsyncSuccess, isAsyncError, isFormValid } from '@/types/discriminated-unions';

/**
 * Hook for managing async operations with discriminated union state
 */
export function useAsyncState<T, E = string>(initialState: AsyncState<T, E> = { status: 'idle' }) {
  const [state, setState] = React.useState<AsyncState<T, E>>(initialState);

  const execute = React.useCallback(async (asyncFn: () => Promise<T>) => {
    setState({ status: 'loading' });
    
    try {
      const data = await asyncFn();
      setState({ status: 'success', data });
      return { success: true as const, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ status: 'error', error: errorMessage as E });
      return { success: false as const, error: errorMessage };
    }
  }, []);

  const reset = React.useCallback(() => {
    setState({ status: 'idle' });
  }, []);

  // Create safe accessors with proper type narrowing
  const getSuccessData = () => isAsyncSuccess(state) ? state.data : undefined;
  const getErrorMessage = () => isAsyncError(state) ? state.error : undefined;

  return {
    state,
    execute,
    reset,
    isLoading: state.status === 'loading',
    isSuccess: isAsyncSuccess(state),
    isError: isAsyncError(state),
    data: getSuccessData(),
    error: getErrorMessage(),
  };
}

/**
 * Hook for managing form state with validation
 */
export function useFormState<T>(initialData: Partial<T> = {}) {
  const [state, setState] = React.useState<FormState<T>>({ 
    status: 'idle', 
    data: initialData 
  });

  const updateData = React.useCallback((updates: Partial<T>) => {
    setState(prev => {
      // Preserve the current status while updating data
      if (prev.status === 'valid') {
        return { status: 'valid', data: { ...prev.data, ...updates } as T };
      } else if (prev.status === 'invalid') {
        return { 
          status: 'invalid', 
          data: { ...prev.data, ...updates },
          errors: prev.errors
        };
      } else {
        return {
          status: prev.status,
          data: { ...prev.data, ...updates }
        };
      }
    });
  }, []);

  const setValidating = React.useCallback(() => {
    setState(prev => ({ status: 'validating', data: prev.data }));
  }, []);

  const setValid = React.useCallback((data: T) => {
    setState({ status: 'valid', data });
  }, []);

  const setInvalid = React.useCallback((errors: Record<keyof T, string[]>) => {
    setState(prev => ({ 
      status: 'invalid', 
      data: prev.data, 
      errors 
    }));
  }, []);

  const reset = React.useCallback(() => {
    setState({ status: 'idle', data: initialData });
  }, [initialData]);

  return {
    state,
    updateData,
    setValidating,
    setValid,
    setInvalid,
    reset,
    isValid: isFormValid(state),
    isValidating: state.status === 'validating',
    data: state.data,
    errors: state.status === 'invalid' ? state.errors : undefined,
  };
}