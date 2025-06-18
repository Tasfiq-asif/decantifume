import axios from "axios";
import { getSession } from "next-auth/react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      try {
        // Get NextAuth session
        const session = await getSession();
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
      } catch (error) {
        console.error("Error getting session:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Check if we have a valid session before redirecting
      if (typeof window !== "undefined") {
        try {
          const session = await getSession();
          if (!session) {
            // Only redirect if there's no session
            window.location.href = "/login";
          }
        } catch {
          // If we can't get session, redirect to login
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
