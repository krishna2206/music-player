import { useTracksStore } from "@/stores/useTracksStore";

export function useTracks() {
  const { 
    tracks, 
    addTrack, 
    addTracks,
    updateTrack, 
    removeTrack, 
    clearTracks,
    getTrackById, 
    searchTracks,
  } = useTracksStore();

  return {
    tracks,
    addTrack,
    addTracks,
    updateTrack,
    removeTrack,
    clearTracks,
    getTrackById,
    searchTracks,
  };
}