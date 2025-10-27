import { createContext, useContext } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  verify2FA: (token: string) => Promise<void>;
  setToken: (token: string) => void; // Add this line
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
