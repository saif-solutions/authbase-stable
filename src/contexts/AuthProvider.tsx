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
    isInitialized: true, // Set to true since we're not doing initial check
    login,
    register: login, // Temporary - use login for register
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
