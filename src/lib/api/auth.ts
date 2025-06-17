import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

// Axios instance for API calls
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Types
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// API Functions
export const authAPI = {
  // Register new user
  register: async (userData: RegisterData): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post("/v1/auth/register", userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  // Login user (used internally by NextAuth)
  login: async (credentials: LoginData): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post("/v1/auth/login", credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  // Change password (requires authentication)
  changePassword: async (
    passwordData: ChangePasswordData,
    accessToken: string
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post(
        "/v1/auth/change-password",
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Password change failed"
      );
    }
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post("/v1/auth/refresh-token", {
        refreshToken,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Token refresh failed");
    }
  },
};

// Axios interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get session and refresh token
        const { getSession } = await import("next-auth/react");
        const session = await getSession();

        if (session?.refreshToken) {
          const refreshResponse = await authAPI.refreshToken(
            session.refreshToken
          );

          if (refreshResponse.success) {
            // Update the authorization header and retry the request
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
