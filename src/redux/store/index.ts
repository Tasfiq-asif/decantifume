import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";

// Import core slices (always loaded)

import cartSlice from "../slices/cartSlice";
import userSlice from "../slices/userSlice";

// Core reducers that are always loaded
const coreReducers = {
  cart: cartSlice,
  user: userSlice, // Handles all auth state with NextAuth sync
};

// Create initial root reducer with core reducers
const createRootReducer = (asyncReducers = {}) =>
  combineReducers({
    ...coreReducers,
    ...asyncReducers,
  });

// Configure store
export const store = configureStore({
  reducer: createRootReducer(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
