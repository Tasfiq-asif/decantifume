import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";

// Import slices (we'll create these next)
import authSlice from "./slices/authSlice";
import cartSlice from "./slices/cartSlice";
import uiSlice from "./slices/uiSlice";

// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
  cart: cartSlice,
  ui: uiSlice,
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
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
