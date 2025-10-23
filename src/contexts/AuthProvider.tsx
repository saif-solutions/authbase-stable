import { useEffect, useState, ReactNode } from "react";
import { AuthContext, AuthContextType, User } from "./AuthContext";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
} from "../services/authAPI";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if user is already logged in on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("🔧 DEBUG: Initializing auth state...");
        const userData = await getCurrentUser();

        if (userData) {
          console.log(
            "🔧 DEBUG: User found on initialization:",
            userData.email
          );
          setUser(userData);
        } else {
          console.log("🔧 DEBUG: No user found on initialization");
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

      const userData = await apiLogin(email, password);
      console.log("🔧 DEBUG: Login successful:", userData.email);

      setUser(userData);
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

      const userData = await apiRegister(email, password, name);
      console.log("🔧 DEBUG: Registration successful:", userData.email);

      setUser(userData);
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
      await apiLogout();
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
