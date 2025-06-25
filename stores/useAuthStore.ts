import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthStateStore {
  session: Session | null;
  user: User | null;
  isAuthenticating: boolean;
  isAuthenticated: boolean;

  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

const AUTH_STATE_STORAGE_KEY = '@auth';

export const useAuthStore = create<AuthStateStore>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      isAuthenticating: true,
      isAuthenticated: false,

      setSession: (session: Session | null) => {
        set({ 
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session,
          isAuthenticating: false
        });
      },

      setLoading: (authenticating: boolean) => {
        set({ isAuthenticating: authenticating });
      },

      clearAuth: () => {
        set({ 
          session: null, 
          user: null, 
          isAuthenticated: false,
          isAuthenticating: false 
        });
      }
    }),
    {
      name: AUTH_STATE_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        session: state.session,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);