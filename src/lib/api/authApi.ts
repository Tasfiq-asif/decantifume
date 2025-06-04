import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../slices/authSlice";

// Types for API requests/responses
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Mock API functions (replace with real API calls)
const authAPI = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<User>> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful response
    if (
      credentials.email === "test@example.com" &&
      credentials.password === "password"
    ) {
      return {
        success: true,
        data: {
          id: "1",
          email: credentials.email,
          name: "Test User",
        },
      };
    }

    throw new Error("Invalid credentials");
  },

  register: async (data: RegisterData): Promise<ApiResponse<User>> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      data: {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
      },
    };
  },

  logout: async (): Promise<ApiResponse<null>> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      data: null,
    };
  },

  refreshToken: async (): Promise<ApiResponse<User>> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock user data
    return {
      success: true,
      data: {
        id: "1",
        email: "test@example.com",
        name: "Test User",
      },
    };
  },
};

// Async thunks for auth actions
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return null;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Logout failed"
      );
    }
  }
);

export const refreshUserToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.refreshToken();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Token refresh failed"
      );
    }
  }
);
