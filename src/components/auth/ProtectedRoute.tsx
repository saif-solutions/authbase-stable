export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // TEMPORARY: Completely remove auth checks to break the loop
  return <>{children}</>;
}
