# Lazy Loading Implementation

This project implements comprehensive lazy loading techniques to improve performance and reduce initial bundle size.

## Features Implemented

### 1. Redux Reducer Lazy Loading

- **Location**: `src/lib/store/lazyReducers.ts`
- **Purpose**: Load Redux slices only when needed
- **Usage**:

  ```typescript
  import { useLazyReducer } from "@/lib/hooks/useLazyReducer";

  const { loadReducer, isLoaded } = useLazyReducer("products", false);
  ```

### 2. Component Lazy Loading

- **Location**: `src/components/LazyComponents.tsx`
- **Purpose**: Load React components only when needed
- **Features**:
  - Higher-order component for wrapping lazy components
  - Custom loading skeletons
  - Error boundaries
- **Usage**:

  ```typescript
  import { createLazyComponent } from "@/components/LazyComponents";

  const LazyComponent = createLazyComponent(
    () => import("./HeavyComponent"),
    <LoadingSkeleton />
  );
  ```

### 3. Image Lazy Loading

- **Location**: `src/components/LazyImage.tsx`
- **Purpose**: Load images only when they come into viewport
- **Features**:
  - Intersection Observer API
  - Placeholder support
  - Error handling
  - Smooth transitions
- **Usage**:
  ```typescript
  <LazyImage
    src="image.jpg"
    alt="Description"
    placeholder="placeholder.jpg"
    onLoad={() => console.log("Loaded")}
  />
  ```

## Demo Page

Visit `/lazy-demo` to see all lazy loading techniques in action.

## Performance Benefits

1. **Reduced Initial Bundle Size**: Core features load first, optional features load on demand
2. **Faster Time to Interactive**: Critical path is shorter
3. **Better User Experience**: Skeleton screens provide immediate feedback
4. **Memory Efficiency**: Components are only loaded when needed
5. **Network Optimization**: Images load only when visible

## Best Practices

1. **Route-level Code Splitting**: Use Next.js dynamic imports for pages
2. **Component-level Splitting**: Lazy load heavy components not immediately visible
3. **Redux State Management**: Only load reducers for features being used
4. **Image Optimization**: Use intersection observer for images below the fold
5. **Preloading**: Preload critical resources that will definitely be needed

## Implementation Details

### Redux Lazy Loading

- Core reducers (auth, cart, ui) are always loaded
- Feature-specific reducers (products, orders, wishlist) are loaded on demand
- Store is dynamically updated when new reducers are injected

### Component Lazy Loading

- Uses React.lazy() and Suspense
- Custom HOC provides consistent loading states
- Error boundaries prevent crashes from failed imports

### Image Lazy Loading

- Intersection Observer with configurable thresholds
- Blur-to-sharp transition for better UX
- Fallback handling for failed loads

## Browser Support

- Modern browsers with Intersection Observer support
- Polyfill available for older browsers
- Graceful degradation for unsupported features

## Monitoring

- Console logs for debugging lazy loading events
- Performance metrics can be added using Web Vitals
- Bundle analyzer can show code splitting effectiveness
