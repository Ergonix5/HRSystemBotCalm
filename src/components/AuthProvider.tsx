"use client";

import { useEffect } from "react";
import { useAuth } from "../app/store/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchMe } = useAuth();

  useEffect(() => {
    fetchMe();
  }, []);

  return <>{children}</>;
}
