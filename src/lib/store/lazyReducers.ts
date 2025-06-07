import { combineReducers, Reducer } from "@reduxjs/toolkit";
import { store } from "../store";

// Define the shape of our lazy reducers
type LazyReducers = {
  [key: string]: () => Promise<{ default: Reducer }>;
};

// Registry for lazy reducers
const lazyReducers: LazyReducers = {
  // Add lazy reducers here as needed
  products: () => import("../slices/productSlice"),
  orders: () => import("../slices/orderSlice"),
  wishlist: () => import("../slices/wishlistSlice"),
};

// Track which reducers have been loaded
const loadedReducers = new Set<string>();

// Function to dynamically load and inject a reducer
export const injectReducer = async (key: string) => {
  if (loadedReducers.has(key) || !lazyReducers[key]) {
    return;
  }

  try {
    const reducerModule = await lazyReducers[key]();
    const reducer = reducerModule.default;

    // Get current reducers
    const currentReducers = store.getState();

    // Create new root reducer with the injected reducer
    const newRootReducer = combineReducers({
      ...currentReducers,
      [key]: reducer,
    });

    // Replace the reducer in the store
    store.replaceReducer(newRootReducer);

    loadedReducers.add(key);
    console.log(`Lazy loaded reducer: ${key}`);
  } catch (error) {
    console.error(`Failed to load reducer ${key}:`, error);
  }
};

// Function to preload reducers
export const preloadReducers = async (keys: string[]) => {
  const promises = keys.map((key) => injectReducer(key));
  await Promise.all(promises);
};

// Hook to use lazy reducer
export const useLazyReducer = (key: string) => {
  return {
    load: () => injectReducer(key),
    isLoaded: loadedReducers.has(key),
  };
};
