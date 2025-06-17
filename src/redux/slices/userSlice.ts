import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  // Additional user preferences that you want to persist in Redux
  preferences: {
    theme: "light" | "dark";
    language: string;
    currency: string;
    notifications: boolean;
  };
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  accessToken: null,
  preferences: {
    theme: "dark",
    language: "en",
    currency: "USD",
    notifications: true,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Sync with NextAuth session
    setUserFromSession: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    // Clear user data (on logout)
    clearUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    // Loading state management
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Error management
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    // User preferences (these persist in Redux/localStorage)
    updatePreferences: (
      state,
      action: PayloadAction<Partial<UserState["preferences"]>>
    ) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    // Update user profile
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  setUserFromSession,
  clearUser,
  setLoading,
  setError,
  clearError,
  updatePreferences,
  updateUserProfile,
} = userSlice.actions;

export default userSlice.reducer;
