import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Spinner } from "../components/ui";
export function RequireAuth({ children, admin }: { children: React.ReactNode; admin?: boolean }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to={`/sign-in?next=${encodeURIComponent(loc.pathname)}`} replace />;
  if (admin && !user.isPlatformAdmin && user.platformRole !== "admin" && user.platformRole !== "moderator") return <Navigate to="/" replace />;
  return <>{children}</>;
}