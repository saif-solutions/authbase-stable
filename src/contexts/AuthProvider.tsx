import { useState, useEffect, ReactNode } from "react";
import { AuthContext, AuthContextType } from "./AuthContext";
import { User, LoginCredentials } from "@/types/api";
import { authAPI } from "@/services/authAPI";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Only run auth check once
    if (hasCheckedAuth) return;

    const initAuth = async () => {
      try {
        console.log("🔧 DEBUG: Initial auth check");
        const response = await authAPI.getCurrentUser();
        console.log("🔧 DEBUG: Auth check successful", response.data.user);
        setUser(response.data.user);
      } catch {
        console.log(
          "🔧 DEBUG: Not authenticated (this is normal for first visit)"
        );
        // User is not logged in, which is fine
      } finally {
        setIsLoading(false);
        setHasCheckedAuth(true);
      }
    };

    initAuth();
  }, [hasCheckedAuth]); // Only depend on hasCheckedAuth

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log("🔧 DEBUG: Attempting login with:", credentials);
      const response = await authAPI.login(credentials);
      console.log("🔧 DEBUG: Login response:", response);

      // Backend sets token as HTTP-only cookie, so we don't need to store it
      // Just set the user data from response
      setUser(response.data.user);
      setHasCheckedAuth(true); // Mark as checked to prevent further auth calls
    } catch (error) {
      console.error("🔧 DEBUG: Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setHasCheckedAuth(false); // Reset auth check state
      window.location.href = "/login";
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
