import { useEffect, useState } from "react";
import { injectReducer } from "../store/lazyReducers";

/**
 * Hook to lazy load Redux reducers
 * @param reducerKey - The key of the reducer to load
 * @param autoLoad - Whether to automatically load the reducer on mount
 */
export const useLazyReducer = (reducerKey: string, autoLoad = true) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReducer = async () => {
    if (isLoaded || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await injectReducer(reducerKey);
      setIsLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reducer");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoLoad) {
      loadReducer();
    }
  }, [reducerKey, autoLoad]);

  return {
    loadReducer,
    isLoading,
    isLoaded,
    error,
  };
};
