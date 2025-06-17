import { useSession, signIn, signOut } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import {
  setUserFromSession,
  clearUser,
  setLoading,
  setError,
} from "@/redux/slices/userSlice";
import { useEffect } from "react";
import { useLoading } from "@/lib/providers/LoadingProvider";

export const useAuth = () => {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const { setLoading: setGlobalLoading } = useLoading();

  // Sync NextAuth session with Redux
  useEffect(() => {
    if (status === "loading") {
      dispatch(setLoading(true));
      return;
    }

    if (status === "authenticated" && session) {
      dispatch(
        setUserFromSession({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.name!,
            role: session.user.role,
          },
          accessToken: session.accessToken,
        })
      );
    } else if (status === "unauthenticated") {
      dispatch(clearUser());
    }
  }, [session, status, dispatch]);

  // Custom login function
  const login = async (credentials: { email: string; password: string }) => {
    try {
      dispatch(setLoading(true));
      setGlobalLoading(true, "Signing you in...");
      dispatch(setError(null));

      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        dispatch(setError("Invalid credentials"));
        return { success: false, error: "Invalid credentials" };
      }

      setGlobalLoading(true, "Welcome back!");
      setTimeout(() => setGlobalLoading(false), 1000); // Brief success message
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Custom logout function
  const logout = async () => {
    try {
      dispatch(setLoading(true));
      setGlobalLoading(true, "Signing you out...");
      await signOut({ redirect: false });
      dispatch(clearUser());
      setGlobalLoading(false);
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Logout failed";
      dispatch(setError(errorMessage));
      setGlobalLoading(false);
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    // NextAuth session data
    session,
    status,

    // Redux state (includes user preferences)
    user: userState.user,
    isAuthenticated: userState.isAuthenticated,
    isLoading: userState.isLoading || status === "loading",
    error: userState.error,
    accessToken: userState.accessToken,
    preferences: userState.preferences,

    // Combined auth functions
    login,
    logout,

    // NextAuth functions (direct access)
    signIn,
    signOut,
  };
};
