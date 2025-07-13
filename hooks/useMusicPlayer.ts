import { useMusicPlayerStore } from '@/stores/useMusicPlayerStore';
import { Track } from '@/types/music';
import { useEffect } from 'react';
import TrackPlayer, { Event, State, Track as TrackPlayerTrack, useActiveTrack, usePlaybackState, useProgress } from 'react-native-track-player';

const useMusicPlayer = () => {
  const playerState = usePlaybackState();
  const activeTrack = useActiveTrack();
  const trackPlayerProgress = useProgress();
  const { 
    isPlaying, 
    currentTrack: storedCurrentTrack,
    progress: storedProgress,
    setIsPlaying, 
    setCurrentTrack, 
    setProgress, 
    repeatMode 
  } = useMusicPlayerStore();

  // Use stored track if TrackPlayer doesn't have an active track
  const currentTrack = activeTrack || storedCurrentTrack;

  // Use stored progress if TrackPlayer doesn't have progress (e.g., on app restart)
  const progress = trackPlayerProgress.duration > 0 ? trackPlayerProgress : storedProgress;

  const convertTrackToPlayerFormat = (track: Track): TrackPlayerTrack => {
    return {
      id: track.id || track.file_path,
      url: track.file_path,
      title: track.title || track.file_name.replace(/\.[^/.]+$/, ''),
      artist: track.artist || 'Unknown Artist',
      album: track.album || 'Unknown Album',
      artwork: track.cover_image || track.custom_cover_url,
      duration: track.duration,
      genre: track.genre,
      date: track.year?.toString(),
    };
  }

  // Restore TrackPlayer state on app startup
  const restorePlayerState = async () => {
    try {
      if (storedCurrentTrack && !activeTrack) {
        // Only restore if TrackPlayer doesn't have an active track
        const queue = await TrackPlayer.getQueue();
        if (queue.length === 0) {
          await TrackPlayer.add(storedCurrentTrack);
          // Restore position if we have stored progress
          if (storedProgress.position > 0) {
            await TrackPlayer.seekTo(storedProgress.position);
          }
          // Don't auto-play, just restore the track
        }
      }
    } catch (error) {
      console.error('Error restoring player state:', error);
    }
  };

  const setupEventListeners = () => {
    TrackPlayer.addEventListener(Event.PlaybackState, async (event) => {
      setIsPlaying(event.state === State.Playing);
    });

    TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async (event) => {
      if (event.track) {
        setCurrentTrack(event.track);
      }
    });
  }

  const playTrack = async (track: Track, allTracks?: Track[]): Promise<void> => {
    try {
      await TrackPlayer.reset();
      const playerTrack = convertTrackToPlayerFormat(track);

      let queue: TrackPlayerTrack[] = [playerTrack];

      // If allTracks is provided, queue all tracks after the selected one
      if (allTracks) {
        const startIndex = allTracks.findIndex(t => t.id === track.id);
        if (startIndex !== -1) {
          const followingTracks = allTracks.slice(startIndex + 1).map(convertTrackToPlayerFormat);
          queue = [playerTrack, ...followingTracks];
        }
      }

      await TrackPlayer.add(queue);
      await TrackPlayer.play();
    } catch (error) {
      console.error('Error playing track:', error);
      throw error;
    }
  }

  const togglePlayPause = async (): Promise<void> => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  }

  const skipToPrevious = async () => {
    try {
      if (repeatMode === 'track') {
        await TrackPlayer.seekTo(0);
        await TrackPlayer.play();
        return;
      }
      await TrackPlayer.skipToPrevious();
    } catch {
      console.log('No previous track available');
    }
  }

  const skipToNext = async () => {
    try {
      if (repeatMode === 'track') {
        await TrackPlayer.seekTo(0);
        await TrackPlayer.play();
        return;
      }
      await TrackPlayer.skipToNext();
    } catch {
      console.log('No next track available');
    }
  }

  useEffect(() => {
    setupEventListeners();
    restorePlayerState();
  }, [])

  useEffect(() => {
    if (activeTrack) {
      setCurrentTrack(activeTrack);
    }
    // Only update progress from TrackPlayer if it has valid duration
    if (trackPlayerProgress.duration > 0) {
      setProgress(trackPlayerProgress);
    }
  }, [activeTrack, trackPlayerProgress])

  return {
    isPlaying,
    playerState,
    currentTrack,
    progress,

    playTrack,
    togglePlayPause,
    skipToPrevious,
    skipToNext
  };
};

export default useMusicPlayer;