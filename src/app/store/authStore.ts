import { create } from "zustand";

const BASE_URL = "http://localhost:3000";

async function request<T>(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}) as any);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data as T;
}

type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
  permissions: string[];
  [k: string]: any;
} | null;

type AuthState = {
  user: User;
  loading: boolean;
  permissions: string[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  has: (perm: string) => boolean;
  hasAny: (perms: string[]) => boolean;
  hasAll: (perms: string[]) => boolean;
  clear: () => void;
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  permissions: [],

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await request<{
        user: {
          id: string;
          name: string;
          email: string;
          role?: string;
          permissions: string[];
        };
      }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      set({
        user: res.user,
        permissions: res.user.permissions || [],
        loading: false,
      });
      await get().fetchMe(); // ADD THIS LINE
    } catch (e: any) {
      set({ loading: false });
      throw e;
    }
  },

  logout: async () => {
    try {
      await request("/api/auth/logout", { method: "POST" });
      set({ user: null, permissions: [] });
    } catch (e) {
      set({ user: null, permissions: [] });
    }
  },

  fetchMe: async () => {
  set({ loading: true });
  try {
    const res = await request<{ user: any }>('/api/auth/me');
    if (res.user) {
      set({ 
        user: res.user, 
        permissions: res.user.permissions || [],
        loading: false 
      });
    } else {
      set({ loading: false });
    }
  } catch (error) {
    console.log('Failed to fetch user:', error);
    set({ loading: false });
  }
},


  has: (perm) => get().permissions.includes(perm),
  hasAny: (perms) => perms.some((p) => get().permissions.includes(p)),
  hasAll: (perms) => perms.every((p) => get().permissions.includes(p)),
  clear: () => set({ user: null, permissions: [] }),
}));
