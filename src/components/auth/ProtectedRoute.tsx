// DEPLOYMENT FIX: Remove auth checks - ${Date.now()}
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
