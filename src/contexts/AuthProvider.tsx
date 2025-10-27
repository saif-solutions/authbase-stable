import { useState, ReactNode, useEffect } from "react";
import { AuthContext, AuthContextType, User } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");

      if (token) {
        // Try to get user data from backend
        try {
          const response = await fetch("http://localhost:5000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // If backend call fails, use stored data
            const storedUserData = localStorage.getItem("userData");
            const storedEmail = localStorage.getItem("userEmail");

            if (storedUserData) {
              setUser(JSON.parse(storedUserData));
            } else if (storedEmail) {
              // Fallback for OAuth users
              setUser({
                id: "oauth-user",
                email: storedEmail,
                name: storedEmail.split("@")[0], // Generate name from email
                emailVerified: true,
                createdAt: new Date().toISOString(),
              });
            }
          }
        } catch (error) {
          console.log("Failed to fetch user data, using stored data:", error);
          // Use stored data as fallback
          const storedUserData = localStorage.getItem("userData");
          const storedEmail = localStorage.getItem("userEmail");

          if (storedUserData) {
            setUser(JSON.parse(storedUserData));
          } else if (storedEmail) {
            setUser({
              id: "oauth-user",
              email: storedEmail,
              name: storedEmail.split("@")[0],
              emailVerified: true,
              createdAt: new Date().toISOString(),
            });
          }
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  const setToken = (token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("accessToken", token);
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle OAuth user specific error
        if (errorData.code === "OAUTH_USER_NO_PASSWORD") {
          const providers = errorData.availableProviders || ["social"];
          const providerNames = providers
            .map((p: string) => p.charAt(0).toUpperCase() + p.slice(1))
            .join(" or ");
          throw new Error(`Please login with your ${providerNames} account`);
        }

        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();

      // Check if 2FA is required
      if (data.requires2FA) {
        console.log("🔧 DEBUG: 2FA required, storing temp token");
        localStorage.setItem("temp2FAToken", data.temp2FAToken);
        localStorage.setItem("pendingUserEmail", data.user.email);
        localStorage.setItem("pendingUserId", data.user.id);
        throw new Error("2FA_REQUIRED");
      }

      // Set user and store data
      setUser(data.user);
      localStorage.setItem("userData", JSON.stringify(data.user));
      localStorage.setItem("userEmail", data.user.email);

      // Store tokens
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("token", data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
    } catch (error: unknown) {
      // Fix the any type here
      console.error("🔧 DEBUG: Login failed:", error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Login failed. Please check your credentials.");
      }
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

      // Set user and store data
      setUser(data.user);
      localStorage.setItem("userData", JSON.stringify(data.user));
      localStorage.setItem("userEmail", data.user.email);

      // Store tokens
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("token", data.accessToken);
      }
      if (data.refreshToken) {
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

      const response = await fetch("http://localhost:5000/api/auth/register", {
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
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      const data = await response.json();

      // Set user and store data
      setUser(data.user);
      localStorage.setItem("userData", JSON.stringify(data.user));
      localStorage.setItem("userEmail", data.user.email);

      // Store tokens
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("token", data.accessToken);
      }
      if (data.refreshToken) {
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
      // Clear all stored data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("temp2FAToken");
      localStorage.removeItem("pendingUserEmail");
      localStorage.removeItem("pendingUserId");

      // Call backend logout
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("🔧 DEBUG: Logout error:", error);
      // Still clear all data and redirect
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("userEmail");
      setUser(null);
      window.location.href = "/login";
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isInitialized,
    login,
    register,
    logout,
    verify2FA,
    setToken, // Add setToken method
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
