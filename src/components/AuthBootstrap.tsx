// src/components/AuthBootstrap.tsx
"use client";
import { useEffect } from "react";
import { useAuth } from "../app/store/authStore";

export default function AuthBootstrap() {
  const setUser = useAuth((s) => s.setUser);
  const clear = useAuth((s) => s.clear);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:3000/auth/me`, {
          credentials: "include", // cookie auth
        });
        if (!res.ok) throw new Error("UNAUTH");
        const data = await res.json();
        setUser(data.user);
      } catch {
        clear();
      }
    })();
  }, [setUser, clear]);

  return null;
}
