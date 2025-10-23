import { useEffect, useState, ReactNode } from "react";
import { AuthContext, AuthContextType, User } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if user is already logged in on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("🔧 DEBUG: Initializing auth state...");

        // Use direct fetch instead of authAPI to avoid circular dependencies
        const response = await fetch(
          "https://authbase-pro.onrender.com/api/auth/me",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(
            "🔧 DEBUG: User found on initialization:",
            data.user.email
          );
          setUser(data.user);
        } else {
          console.log(
            "🔧 DEBUG: Not authenticated (this is normal for first visit)"
          );
          setUser(null);
        }
      } catch (error) {
        console.error("🔧 DEBUG: Auth initialization error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
        console.log("🔧 DEBUG: Auth initialization complete");
      }
    };

    initializeAuth();
  }, []);

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
          body: JSON.stringify({ email, password, name }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
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
    } catch (error) {
      console.error("🔧 DEBUG: Logout error:", error);
    } finally {
      setUser(null);
      console.log("🔧 DEBUG: User logged out locally");
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isInitialized,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
