import { useState, ReactNode } from "react";
import { AuthContext, AuthContextType, User } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      console.log("🔧 DEBUG: Attempting login for:", email);

      const response = await fetch(
        "https://authbase-pro.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      console.log("🔧 DEBUG: Login successful:", data.user.email);

      setUser(data.user);
    } catch (error) {
      console.error("🔧 DEBUG: Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      console.log("🔧 DEBUG: Attempting registration for:", email);

      const response = await fetch(
        "https://authbase-pro.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
            confirmPassword: password, // ← ADD THIS LINE
            name,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log("🔧 DEBUG: Backend validation errors:", errorData);
        throw new Error(errorData.error || "Registration failed");
      }

      const data = await response.json();
      console.log("🔧 DEBUG: Registration successful:", data.user.email);

      setUser(data.user);
    } catch (error) {
      console.error("🔧 DEBUG: Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log("🔧 DEBUG: Logging out user");
      await fetch("https://authbase-pro.onrender.com/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Clear local state immediately
      setUser(null);

      // Force navigation to login
      window.location.href = "/login";
    } catch (error) {
      console.error("🔧 DEBUG: Logout error:", error);
      // Still clear state and redirect even if API call fails
      setUser(null);
      window.location.href = "/login";
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isInitialized: true,
    login,
    register, // FIXED: Now calls the actual register function
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
