import { useState, ReactNode } from "react";
import { AuthContext, AuthContextType, User } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login", // Changed to localhost for testing
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include", // Important for cookies
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();

      // Check if 2FA is required
      if (data.requires2FA) {
        console.log("🔧 DEBUG: 2FA required, storing temp token");
        // Store 2FA data for verification
        localStorage.setItem("temp2FAToken", data.temp2FAToken);
        localStorage.setItem("pendingUserEmail", data.user.email);
        localStorage.setItem("pendingUserId", data.user.id);

        // Throw special error to trigger 2FA flow
        throw new Error("2FA_REQUIRED");
      }

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

  const verify2FA = async (token: string): Promise<void> => {
    try {
      setIsLoading(true);

      const temp2FAToken = localStorage.getItem("temp2FAToken");
      if (!temp2FAToken) {
        throw new Error("No pending 2FA verification");
      }

      const response = await fetch(
        "http://localhost:5000/api/auth/2fa/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ temp2FAToken, token }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "2FA verification failed");
      }

      const data = await response.json();

      // Set user and store tokens
      setUser(data.user);
      if (data.accessToken && data.refreshToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      // Clear 2FA pending data
      localStorage.removeItem("temp2FAToken");
      localStorage.removeItem("pendingUserEmail");
      localStorage.removeItem("pendingUserId");
    } catch (error) {
      console.error("🔧 DEBUG: 2FA verification failed:", error);
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
    verify2FA,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
