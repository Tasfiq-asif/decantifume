"use client";

import { useLoading } from "@/lib/providers/LoadingProvider";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function usePageLoading() {
  const { setLoading } = useLoading();
  const router = useRouter();

  const navigateWithLoading = useCallback(
    (path: string, message: string = "Loading page...") => {
      setLoading(true, message);
      router.push(path);
      // Loading will be cleared when the new page loads
      setTimeout(() => setLoading(false), 2000); // Fallback timeout
    },
    [setLoading, router]
  );

  const withLoading = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      message: string = "Loading..."
    ): Promise<T> => {
      setLoading(true, message);
      try {
        const result = await asyncFn();
        return result;
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const showLoadingFor = useCallback(
    (duration: number, message: string = "Loading...") => {
      setLoading(true, message);
      setTimeout(() => setLoading(false), duration);
    },
    [setLoading]
  );

  return {
    navigateWithLoading,
    withLoading,
    showLoadingFor,
    setLoading,
  };
}
