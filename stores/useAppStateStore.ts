import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, RelativePathString } from 'expo-router';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppStateStore {
  hasCompletedOnboarding: boolean;
  lastActiveTab: Href | RelativePathString;
  // Add other one-time UI states here
  
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setLastActiveTab: (routeName: string) => void;
  
  // Add methods for other states
}

const APP_STATE_STORAGE_KEY = '@app_state';

export const useAppStateStore = create<AppStateStore>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      lastActiveTab: '/(tabs)',
      
      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },
      
      resetOnboarding: () => {
        set({ hasCompletedOnboarding: false });
      },

      setLastActiveTab: (routeName: string) => {
        if (routeName === 'index') { routeName = ''; }
        set({ lastActiveTab: `/(tabs)/${routeName}` as Href | RelativePathString });
      }
    }),
    {
      name: APP_STATE_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);