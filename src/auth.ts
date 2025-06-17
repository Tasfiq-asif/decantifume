/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Axios instance for auth API calls
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await authApi.post("/v1/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const { data } = response.data;

          if (response.status === 200 && data) {
            return {
              id: data.user._id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            };
          }

          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          role: user.role,
          accessTokenExpires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.error = token.error as string;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  secret: process.env.NEXTAUTH_SECRET,
});

// Function to refresh access token
async function refreshAccessToken(token: any): Promise<any> {
  try {
    const response = await authApi.post("/v1/auth/refresh-token", {
      refreshToken: token.refreshToken,
    });

    const { data } = response.data;

    if (response.status === 200 && data) {
      return {
        ...token,
        accessToken: data.accessToken,
        accessTokenExpires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        refreshToken: data.refreshToken ?? token.refreshToken,
      };
    }

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
