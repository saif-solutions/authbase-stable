import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, isInitialized } = useAuth();
  const location = useLocation();

  console.log("🔧 DEBUG: ProtectedRoute Debug:", {
    user: !!user,
    isLoading,
    isInitialized,
    pathname: location.pathname,
  });

  // Show loading state during initial auth check
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">
            Checking authentication...
          </span>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return url
  if (!user) {
    console.log("🔧 DEBUG: Not authenticated, redirecting to login");
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname !== "/login" ? location : "/" }}
      />
    );
  }

  // User is authenticated, render children
  console.log("🔧 DEBUG: User authenticated, rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
