"use client";

import { useAuth } from "../app/store/authStore";

interface RequirePermProps {
  perm?: string;
  permAny?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function RequirePerm({ perm, permAny, children, fallback }: RequirePermProps) {
  const { has, user } = useAuth();

  if (!user) {
    return <div>Please login to access this page.</div>;
  }

  const hasPermission = perm ? has(perm) : permAny ? permAny.some(p => has(p)) : true;

  if (!hasPermission) {
    return fallback || <div>You don't have permission to access this page.</div>;
  }

  return <>{children}</>;
}
