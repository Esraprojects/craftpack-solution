'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens } from '@/types';
import { safeSetLocalStorage, safeLocalStorage } from '@/lib/utils';

interface AuthState {
  user:            User | null;
  accessToken:     string | null;
  refreshToken:    string | null;
  isAuthenticated: boolean;
  isLoading:       boolean;
  setAuth:     (user: User, tokens: AuthTokens) => void;
  setUser:     (user: User) => void;
  clearAuth:   () => void;
  setLoading:  (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:            null,
      accessToken:     null,
      refreshToken:    null,
      isAuthenticated: false,
      isLoading:       false,

      setAuth: (user, tokens) => {
        safeSetLocalStorage('access_token',  tokens.accessToken);
        safeSetLocalStorage('refresh_token', tokens.refreshToken);
        set({
          user,
          accessToken:     tokens.accessToken,
          refreshToken:    tokens.refreshToken,
          isAuthenticated: true,
          isLoading:       false,
        });
      },

      setUser: (user) => set({ user }),

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'craftpack-auth',
      partialize: state => ({
        user:         state.user,
        accessToken:  state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
