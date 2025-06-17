"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Loading } from "@/components/ui/loading";

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean, message?: string) => void;
  loadingMessage: string;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  const setLoading = useCallback((loading: boolean, message?: string) => {
    setIsLoading(loading);
    if (message) {
      setLoadingMessage(message);
    }
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, loadingMessage }}>
      {children}
      {isLoading && <Loading fullscreen message={loadingMessage} />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
