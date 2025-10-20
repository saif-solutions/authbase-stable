import { useState, useEffect, ReactNode } from "react";
import { AuthContext, AuthContextType } from "./AuthContext";
import { User, LoginCredentials } from "@/types/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          // In a real app, you'd verify the token with the backend
          // For now, we'll use mock user data
          const mockUser: User = {
            id: "1",
            name: "Admin User",
            email: "admin@authbase.com",
            role: "Admin",
            status: "Active",
            lastLogin: new Date().toISOString(),
            createdAt: "2024-01-10T14:20:00Z",
            verified: true,
          };
          setUser(mockUser);
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("authToken");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      // For demo purposes, we'll simulate API call
      // In real app: const response = await authAPI.login(credentials);

      // Mock login - accept any credentials
      const mockUser: User = {
        id: "1",
        name: "Admin User",
        email: credentials.email,
        role: "Admin",
        status: "Active",
        lastLogin: new Date().toISOString(),
        createdAt: "2024-01-10T14:20:00Z",
        verified: true,
      };

      const mockToken = "mock-jwt-token-" + Date.now();

      localStorage.setItem("authToken", mockToken);
      setUser(mockUser);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    window.location.href = "/login";
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
