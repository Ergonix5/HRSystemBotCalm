"use client";
import { useAuth } from "../app/store/authStore";

interface PermissionCheckProps {
  permission: string;
  children: React.ReactNode;
}

export function PermissionCheck({ permission, children }: PermissionCheckProps) {
  const { has } = useAuth();
  
  if (!has(permission)) return null;
  
  return <>{children}</>;
}
