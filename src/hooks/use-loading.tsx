import { useState, useCallback, useRef } from 'react';

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  retryCount: number;
}

interface UseLoadingOptions {
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: string) => void;
}

export const useLoading = (options: UseLoadingOptions = {}) => {
  const { maxRetries = 3, retryDelay = 1000, onError } = options;
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
    retryCount: 0
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));
  }, []);

  const stopLoading = useCallback((error?: string) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: error || null
    }));
  }, []);

  const resetError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      retryCount: 0
    }));
  }, []);

  const incrementRetryCount = useCallback(() => {
    setState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1
    }));
  }, []);

  const executeWithLoading = useCallback(async (
    operation: (signal?: AbortSignal) => Promise<any>,
    retryOnError = true
  ) => {
    startLoading();
    
    abortControllerRef.current = new AbortController();
    
    try {
      const result = await operation(abortControllerRef.current.signal);
      stopLoading();
      resetError();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      if (retryOnError && state.retryCount < maxRetries) {
        incrementRetryCount();
        
        timeoutRef.current = setTimeout(() => {
          executeWithLoading(operation, retryOnError);
        }, retryDelay);
        
        return null;
      } else {
        stopLoading(errorMessage);
        onError?.(errorMessage);
        return null;
      }
    }
  }, [startLoading, stopLoading, resetError, incrementRetryCount, state.retryCount, maxRetries, retryDelay, onError]);

  const cancelOperation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    stopLoading();
  }, [stopLoading]);

  return {
    isLoading: state.isLoading,
    error: state.error,
    retryCount: state.retryCount,
    executeWithLoading,
    startLoading,
    stopLoading,
    resetError,
    cancelOperation
  };
}; 