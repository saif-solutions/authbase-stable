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
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      console.log("🔧 DEBUG: Login successful:", data.user.email);
      console.log("🔧 DEBUG: User data received:", data.user);

      // Make sure we're using the actual user from the response
      setUser(data.user);

      // Store tokens
      if (data.accessToken && data.refreshToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      }
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
          body: JSON.stringify({
            email,
            password,
            confirmPassword: password,
            name,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      const data = await response.json();
      console.log("🔧 DEBUG: Registration successful:", data.user.email);
      console.log("🔧 DEBUG: User data received:", data.user);

      // Make sure we're using the actual user from the response
      setUser(data.user);

      // Store tokens
      if (data.accessToken && data.refreshToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      }
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

      // Clear tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      await fetch("https://authbase-pro.onrender.com/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("🔧 DEBUG: Logout error:", error);
      // Still clear tokens and redirect
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      window.location.href = "/login";
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isInitialized: true,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
