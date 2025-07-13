export interface Artist {
    user_id?: string;
    name: string;
    image_url?: string;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface Album {
    user_id?: string;
    artist_name: string;
    title: string;
    cover_image?: string;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface Playlist {
    user_id?: string;
    name: string;
    description?: string;
    cover_image?: string; // Embedded/default cover
    custom_cover_url?: string; // Custom cover image/video URL
    custom_cover_type?: 'image' | 'video'; // Type of custom cover
    created_at?: string;
    updated_at?: string;
  }
  
  export interface Track {
    id: string;
    user_id?: string;
    file_name: string;
    file_path: string;
    file_size?: number;
    
    // Basic metadata
    title?: string;
    artist?: string;
    album_artist?: string;
    album?: string;
    composer?: string;
    year?: number;
    track_number?: number;
    disc_number?: number;
    genre?: string;
    
    // Audio properties
    duration?: number;
    bitrate?: number;
    sample_rate?: number;
    mpeg_version?: number;
    mpeg_layer?: number;
    
    // Album art
    cover_image?: string; // Embedded album art (base64 data URL)
    custom_cover_url?: string; // Custom cover image/video URL
    custom_cover_type?: 'image' | 'video'; // Type of custom cover
    
    // Platform information
    platform_source?: 'deezer' | 'spotify' | 'soundcloud' | 'apple_music' | 'local' | string;
    platform_track_id?: string;
    
    // Timestamps
    created_at?: string;
    updated_at?: string;
    last_played_at?: string;
    
    // Sync metadata
    is_synced?: boolean;
  }
  
  export interface PlaylistTrack {
    user_id?: string;
    playlist_name: string;
    track_id: string;
    position: number;
    added_at?: string;
  }
  
  // Helper types for cover management
  export type CoverType = 'image' | 'video';
  
  export interface CoverMedia {
    url: string;
    type: CoverType;
  }
  
  // Database entity types (for consistency with table names)
  export type ArtistEntity = Artist;
  export type AlbumEntity = Album;
  export type PlaylistEntity = Playlist;
  export type TrackEntity = Track;
  export type PlaylistTrackEntity = PlaylistTrack;