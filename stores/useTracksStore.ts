import { Track } from '@/types/music';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TracksStore {
  tracks: Track[];
  
  // Track operations
  addTrack: (track: Track) => void;
  addTracks: (tracks: Track[]) => void;
  updateTrack: (id: string, updates: Partial<Track>) => void;
  removeTrack: (id: string) => void;
  clearTracks: () => void;
  
  // Utility functions
  getTrackById: (id: string) => Track | undefined;
  searchTracks: (query: string) => Track[];
}

const TRACKS_STORAGE_KEY = '@tracks_store';

export const useTracksStore = create<TracksStore>()(
  persist(
    (set, get) => ({
      tracks: [],
      
      addTrack: (track: Track) => {
        set((state) => {
          const existingIndex = state.tracks.findIndex(t => t.id === track.id);
          if (existingIndex >= 0) {
            // Update existing track
            const updatedTracks = [...state.tracks];
            updatedTracks[existingIndex] = { ...updatedTracks[existingIndex], ...track };
            return { tracks: updatedTracks };
          }
          // Add new track
          return { tracks: [...state.tracks, track] };
        });
      },
      
      addTracks: (tracks: Track[]) => {
        set((state) => {
          const existingIds = new Set(state.tracks.map(t => t.id));
          const newTracks = tracks.filter(track => !existingIds.has(track.id));
          return { tracks: [...state.tracks, ...newTracks] };
        });
      },
      
      updateTrack: (id: string, updates: Partial<Track>) => {
        set((state) => ({
          tracks: state.tracks.map(track =>
            track.id === id ? { ...track, ...updates, updated_at: new Date().toISOString() } : track
          )
        }));
      },
      
      removeTrack: (id: string) => {
        set((state) => ({
          tracks: state.tracks.filter(track => track.id !== id)
        }));
      },
      
      clearTracks: () => {
        set({ tracks: [] });
      },
      
      getTrackById: (id: string) => {
        const { tracks } = get();
        return tracks.find(track => track.id === id);
      },
      
      searchTracks: (query: string) => {
        const { tracks } = get();
        const lowercaseQuery = query.toLowerCase();
        
        return tracks.filter(track =>
          track.title?.toLowerCase().includes(lowercaseQuery) ||
          track.artist?.toLowerCase().includes(lowercaseQuery) ||
          track.album?.toLowerCase().includes(lowercaseQuery) ||
          track.genre?.toLowerCase().includes(lowercaseQuery)
        );
      },
    }),
    {
      name: TRACKS_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);