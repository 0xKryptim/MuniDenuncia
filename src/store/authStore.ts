import { create } from 'zustand';
import type { User } from '../lib/types';
import { api } from '../lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    try {
      const user = await api.getCurrentUser();
      set({ user, isAuthenticated: !!user, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    const { user } = await api.login({ email, password });
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await api.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
