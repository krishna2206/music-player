import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, RelativePathString } from 'expo-router';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppStateStore {
  // Persistent states
  hasCompletedOnboarding: boolean;
  lastActiveTab: Href | RelativePathString;
  
  // Non-persistent states
  isLoading: boolean;
  
  // Persistent methods
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setLastActiveTab: (routeName: string) => void;
  
  // Non-persistent methods
  setLoading: (loading: boolean) => void;
}

const APP_STATE_STORAGE_KEY = '@app_state';

export const useAppStateStore = create<AppStateStore>()(
  persist(
    (set) => ({
      // Persistent states
      hasCompletedOnboarding: false,
      lastActiveTab: '/(tabs)',
      
      // Non-persistent states
      isLoading: false,
      
      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },
      
      resetOnboarding: () => {
        set({ hasCompletedOnboarding: false });
      },

      setLastActiveTab: (routeName: string) => {
        if (routeName === 'index') { routeName = ''; }
        set({ lastActiveTab: `/(tabs)/${routeName}` as Href | RelativePathString });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: APP_STATE_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        lastActiveTab: state.lastActiveTab,
      }),
    }
  )
);