import { createContext } from "react";
import { User, LoginCredentials } from "@/types/api";

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Create and export the context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
