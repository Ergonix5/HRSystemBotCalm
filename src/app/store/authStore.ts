import { create } from 'zustand';

const BASE_URL =  'http://localhost:3000';

async function request<T>(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}) as any);
  if (!res.ok) throw new Error(data?.message || 'Request failed');
  return data as T;
}

type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
} | null;

type AuthState = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await request<{
        user: {
          id: string;
          name: string;
          email: string;
          role?: string;
        };
      }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      set({ user: res.user, loading: false });
    } catch (e: any) {
      set({ loading: false });
      throw e;
    }
  },

  logout: async () => {
    try {
      await request('/api/auth/logout', { method: 'POST' });
      set({ user: null });
    } catch (e) {
      set({ user: null });
    }
  },
}));
