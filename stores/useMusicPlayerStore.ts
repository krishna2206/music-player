import AsyncStorage from '@react-native-async-storage/async-storage';
import { Progress, Track as TrackPlayerTrack } from 'react-native-track-player';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface PlayerState {
  isPlaying: boolean;
  currentTrack: TrackPlayerTrack | undefined;
  progress: Progress;
  queue: TrackPlayerTrack[];
  repeatMode: 'off' | 'track' | 'queue';
  shuffleMode: boolean;
}  

interface MusicPlayerStore extends PlayerState {
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTrack: (track: TrackPlayerTrack | undefined) => void;
  setProgress: (progress: Progress) => void;
  setQueue: (queue: TrackPlayerTrack[]) => void;
  setRepeatMode: (mode: 'off' | 'track' | 'queue') => void;
  setShuffleMode: (enabled: boolean) => void;
  reset: () => void;
}

const MUSIC_PLAYER_STORAGE_KEY = '@music_player_store';

export const useMusicPlayerStore = create<MusicPlayerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isPlaying: false,
      currentTrack: undefined,
      progress: {
        position: 0,
        duration: 0,
        buffered: 0,
      },
      queue: [],
      repeatMode: 'off',
      shuffleMode: false,

      // Actions
      setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
      
      setCurrentTrack: (track: TrackPlayerTrack | undefined) => set({ currentTrack: track }),

      setProgress: (progress: Progress) => set({ progress: progress }),
      
      setQueue: (queue: TrackPlayerTrack[]) => set({ queue }),

      setRepeatMode: (mode: 'off' | 'track' | 'queue') => set({ repeatMode: mode }),
      
      setShuffleMode: (enabled: boolean) => set({ shuffleMode: enabled }),

      reset: () => set({
        isPlaying: false,
        currentTrack: undefined,
        progress: {
          position: 0,
          duration: 0,
          buffered: 0,
        },
        queue: []
      }),
    }),
    {
      name: MUSIC_PLAYER_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist certain state (not position/duration which are realtime)
      partialize: (state) => ({
        currentTrack: state.currentTrack,
        progress: state.progress,
        repeatMode: state.repeatMode,
        shuffleMode: state.shuffleMode,
      }),
    }
  )
);
