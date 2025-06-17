import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";

// Import core slices (always loaded)

import authSlice from "../slices/authSlice";
import cartSlice from "../slices/cartSlice";
import userSlice from "../slices/userSlice";

// Core reducers that are always loaded
const coreReducers = {
  auth: authSlice, // Keep for backward compatibility or remove later
  cart: cartSlice,
  user: userSlice, // New: syncs with NextAuth
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
