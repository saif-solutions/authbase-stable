import React from "react";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, isInitialized } = useAuth();

  console.log(
    "🔧 DEBUG: ProtectedRoute - user:",
    !!user,
    "loading:",
    isLoading,
    "initialized:",
    isInitialized
  );

  // TEMPORARY: Allow access to all routes without authentication
  // This will break the redirect loop
  return <>{children}</>;
};

export default ProtectedRoute;
