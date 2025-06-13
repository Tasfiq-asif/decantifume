import { Reducer } from "@reduxjs/toolkit";
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
const asyncReducers: Record<string, Reducer> = {};

// Function to dynamically load and inject a reducer
export const injectReducer = async (key: string) => {
  if (loadedReducers.has(key) || !lazyReducers[key]) {
    return;
  }

  try {
    const reducerModule = await lazyReducers[key]();
    const reducer = reducerModule.default;

    // Add to async reducers
    asyncReducers[key] = reducer;

    // Get the current root reducer and replace it
    const { combineReducers } = await import("@reduxjs/toolkit");

    // Import core reducers
    const authSlice = (await import("../slices/authSlice")).default;
    const cartSlice = (await import("../slices/cartSlice")).default;
    const uiSlice = (await import("../slices/uiSlice")).default;

    const newRootReducer = combineReducers({
      auth: authSlice,
      cart: cartSlice,
      ui: uiSlice,
      ...asyncReducers,
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
