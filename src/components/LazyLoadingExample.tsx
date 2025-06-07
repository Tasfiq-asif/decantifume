"use client";

import { useState } from "react";
import { useLazyReducer } from "../lib/hooks/useLazyReducer";
import { LazyImage } from "./LazyImage";
import {
  createLazyComponent,
  ProductGridSkeleton,
  ListSkeleton,
} from "./LazyComponents";

// Example: Lazy load a heavy component
const HeavyDataComponent = createLazyComponent<Record<string, unknown>>(
  () =>
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            default: () => (
              <div className="p-6 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  Heavy Data Component
                </h3>
                <p>
                  This component was lazy loaded after 1 second delay to
                  simulate a heavy import.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-3 bg-white rounded shadow">
                      <div className="h-2 bg-blue-200 rounded mb-2"></div>
                      <div className="h-2 bg-blue-100 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          }),
        1000
      )
    ),
  <div className="p-6 bg-gray-50 rounded-lg animate-pulse">
    <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
    <div className="h-4 bg-gray-200 rounded mb-4"></div>
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-3 bg-gray-100 rounded">
          <div className="h-2 bg-gray-200 rounded mb-2"></div>
          <div className="h-2 bg-gray-200 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  </div>
);

export const LazyLoadingExample = () => {
  const [showHeavyComponent, setShowHeavyComponent] = useState(false);

  // Lazy load reducers
  const { loadReducer: loadProductReducer, isLoaded: isProductLoaded } =
    useLazyReducer("products", false);
  const { loadReducer: loadWishlistReducer, isLoaded: isWishlistLoaded } =
    useLazyReducer("wishlist", false);

  const handleLoadProducts = async () => {
    await loadProductReducer();
    console.log("Products reducer loaded!");
  };

  const handleLoadWishlist = async () => {
    await loadWishlistReducer();
    console.log("Wishlist reducer loaded!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Lazy Loading Examples</h1>
        <p className="text-gray-600">
          Demonstration of various lazy loading techniques
        </p>
      </div>

      {/* Redux Lazy Loading Example */}
      <section className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Redux Reducer Lazy Loading
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLoadProducts}
              disabled={isProductLoaded}
              className={`px-4 py-2 rounded ${
                isProductLoaded
                  ? "bg-green-500 text-white cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isProductLoaded ? "✓ Products Loaded" : "Load Products Reducer"}
            </button>

            <button
              onClick={handleLoadWishlist}
              disabled={isWishlistLoaded}
              className={`px-4 py-2 rounded ${
                isWishlistLoaded
                  ? "bg-green-500 text-white cursor-not-allowed"
                  : "bg-purple-500 text-white hover:bg-purple-600"
              }`}
            >
              {isWishlistLoaded ? "✓ Wishlist Loaded" : "Load Wishlist Reducer"}
            </button>
          </div>

          <div className="text-sm text-gray-600">
            <p>Open DevTools Console to see lazy loading messages.</p>
            <p>
              Status: Products {isProductLoaded ? "✓" : "✗"} | Wishlist{" "}
              {isWishlistLoaded ? "✓" : "✗"}
            </p>
          </div>
        </div>
      </section>

      {/* Component Lazy Loading Example */}
      <section className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Component Lazy Loading</h2>
        <button
          onClick={() => setShowHeavyComponent(!showHeavyComponent)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mb-4"
        >
          {showHeavyComponent ? "Hide" : "Load"} Heavy Component
        </button>

        {showHeavyComponent && <HeavyDataComponent />}
      </section>

      {/* Image Lazy Loading Example */}
      <section className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Image Lazy Loading</h2>
        <p className="text-gray-600 mb-4">
          Scroll down to see lazy loaded images. Images only load when they come
          into view.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="aspect-square">
              <LazyImage
                src={`https://picsum.photos/300/300?random=${index + 1}`}
                alt={`Lazy loaded image ${index + 1}`}
                className="rounded-lg shadow-md"
                onLoad={() => console.log(`Image ${index + 1} loaded`)}
                onError={() => console.log(`Image ${index + 1} failed to load`)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Loading Skeletons Example */}
      <section className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Loading Skeletons</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Product Grid Skeleton</h3>
            <ProductGridSkeleton />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">List Skeleton</h3>
            <ListSkeleton items={4} />
          </div>
        </div>
      </section>

      {/* Performance Tips */}
      <section className="border rounded-lg p-6 bg-yellow-50">
        <h2 className="text-xl font-semibold mb-4">Performance Tips</h2>
        <ul className="space-y-2 text-gray-700">
          <li>
            • Use lazy loading for components that are not immediately visible
          </li>
          <li>
            • Implement intersection observer for images and heavy content
          </li>
          <li>
            • Lazy load Redux reducers for features that might not be used
          </li>
          <li>• Use skeleton screens to improve perceived performance</li>
          <li>• Preload critical resources that will definitely be needed</li>
          <li>• Consider code splitting at the route level</li>
        </ul>
      </section>
    </div>
  );
};
