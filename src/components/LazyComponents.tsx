import { lazy, ComponentType, Suspense } from "react";

// Higher-order component for lazy loading with error boundary
export const withLazyLoading = <T extends Record<string, unknown>>(
  LazyComponent: ComponentType<T>,
  fallback: React.ReactNode = (
    <div className="flex items-center justify-center p-8">Loading...</div>
  )
) => {
  const LazyWrapper = (props: T) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );

  LazyWrapper.displayName = `withLazyLoading(${
    LazyComponent.displayName || LazyComponent.name || "Component"
  })`;

  return LazyWrapper;
};

// Generic loading skeleton components
export const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    ))}
  </div>
);

export const ListSkeleton = ({ items = 3 }: { items?: number }) => (
  <div className="p-6">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Function to create lazy-loaded components with custom fallbacks
export const createLazyComponent = <T extends Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFn);
  return withLazyLoading(LazyComponent, fallback);
};

// Utility for preloading components
export const preloadComponent = (importFn: () => Promise<unknown>) => {
  importFn().catch(console.error);
};
