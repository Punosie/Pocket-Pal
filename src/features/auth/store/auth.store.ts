import { subscribeWithSelector } from 'zustand/middleware';
import { create } from 'zustand/react';

import type { UserProfile } from '@/types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,
    error: null,

    setUser: (user) => set({ user, isAuthenticated: !!user }),

    setLoading: (isLoading) => set({ isLoading }),

    setInitialized: (isInitialized) => set({ isInitialized }),

    setError: (error) => set({ error }),

    reset: () =>
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }),
  })),
);

// Selectors
export const selectUser = (s: AuthState) => s.user;
export const selectIsAuthenticated = (s: AuthState) => s.isAuthenticated;
export const selectIsInitialized = (s: AuthState) => s.isInitialized;
export const selectAuthError = (s: AuthState) => s.error;
