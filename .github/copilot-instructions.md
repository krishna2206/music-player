
## Supabase Schema

````sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create artist table (simplified)
CREATE TABLE public.artist (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    image_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (user_id, name)
);

-- Create album table (simplified)
CREATE TABLE public.album (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    artist_name TEXT NOT NULL,
    title TEXT NOT NULL,
    cover_image TEXT, -- Base64 data URL for album cover
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (user_id, artist_name, title),
    FOREIGN KEY (user_id, artist_name) REFERENCES public.artist(user_id, name) ON DELETE CASCADE
);

-- Create playlist table (simplified)
CREATE TABLE public.playlist (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    cover_image TEXT, -- Base64 data URL for playlist cover
    custom_cover_url TEXT, -- Custom cover image/video URL
    custom_cover_type TEXT CHECK (custom_cover_type IN ('image', 'video')), -- Type of custom cover
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (user_id, name)
);

-- Updated track table
CREATE TABLE public.track (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- File information
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    
    -- Basic metadata
    title TEXT,
    artist TEXT,
    album_artist TEXT,
    album TEXT,
    composer TEXT,
    year INTEGER,
    track_number INTEGER,
    disc_number INTEGER,
    genre TEXT,
    
    -- Audio properties
    duration INTEGER, -- in seconds
    bitrate INTEGER, -- in kbps
    sample_rate INTEGER, -- in Hz
    mpeg_version INTEGER,
    mpeg_layer INTEGER,
    
    -- Album art
    cover_image TEXT, -- Base64 data URL for embedded album art
    custom_cover_url TEXT, -- Custom cover image/video URL
    custom_cover_type TEXT CHECK (custom_cover_type IN ('image', 'video')), -- Type of custom cover
    
    -- Platform source information
    platform_source TEXT, -- 'deezer', 'spotify', 'soundcloud', 'apple_music', 'local', etc.
    platform_track_id TEXT, -- Original track ID from the platform
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_played_at TIMESTAMP WITH TIME ZONE,
    
    -- Sync metadata
    is_synced BOOLEAN DEFAULT FALSE,
    
    -- Foreign key relationships (optional, for data integrity)
    FOREIGN KEY (user_id, artist) REFERENCES public.artist(user_id, name) ON DELETE SET NULL,
    FOREIGN KEY (user_id, artist, album) REFERENCES public.album(user_id, artist_name, title) ON DELETE SET NULL,
    
    UNIQUE(user_id, file_path)
);

-- Create playlist_track table
CREATE TABLE public.playlist_track (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    playlist_name TEXT NOT NULL,
    track_id UUID REFERENCES public.track(id) ON DELETE CASCADE,
    
    -- Position in playlist
    position INTEGER NOT NULL,
    
    -- Timestamps
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (user_id, playlist_name, track_id),
    FOREIGN KEY (user_id, playlist_name) REFERENCES public.playlist(user_id, name) ON DELETE CASCADE,
    UNIQUE(user_id, playlist_name, position)
);

-- Create indexes for artist table
CREATE INDEX idx_artist_user_id ON public.artist(user_id);
CREATE INDEX idx_artist_name ON public.artist(name);

-- Create indexes for album table
CREATE INDEX idx_album_user_id ON public.album(user_id);
CREATE INDEX idx_album_artist_name ON public.album(artist_name);
CREATE INDEX idx_album_title ON public.album(title);

-- Create indexes for playlist table
CREATE INDEX idx_playlist_user_id ON public.playlist(user_id);
CREATE INDEX idx_playlist_name ON public.playlist(name);
CREATE INDEX idx_playlist_custom_cover_type ON public.playlist(custom_cover_type);

-- Create indexes for track table
CREATE INDEX idx_track_user_id ON public.track(user_id);
CREATE INDEX idx_track_title ON public.track(title);
CREATE INDEX idx_track_artist ON public.track(artist);
CREATE INDEX idx_track_album ON public.track(album);
CREATE INDEX idx_track_genre ON public.track(genre);
CREATE INDEX idx_track_platform_source ON public.track(platform_source);
CREATE INDEX idx_track_platform_track_id ON public.track(platform_track_id);
CREATE INDEX idx_track_created_at ON public.track(created_at);
CREATE INDEX idx_track_custom_cover_type ON public.track(custom_cover_type);

-- Create indexes for playlist_track table
CREATE INDEX idx_playlist_track_user_id ON public.playlist_track(user_id);
CREATE INDEX idx_playlist_track_playlist_name ON public.playlist_track(playlist_name);
CREATE INDEX idx_playlist_track_track_id ON public.playlist_track(track_id);
CREATE INDEX idx_playlist_track_position ON public.playlist_track(position);

-- Create updated_at triggers for all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_artist_updated_at
    BEFORE UPDATE ON public.artist
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_album_updated_at
    BEFORE UPDATE ON public.album
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlist_updated_at
    BEFORE UPDATE ON public.playlist
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_track_updated_at
    BEFORE UPDATE ON public.track
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) for all tables
ALTER TABLE public.artist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.track ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_track ENABLE ROW LEVEL SECURITY;

-- RLS Policies for artist
CREATE POLICY "Users can view their own artist" ON public.artist
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own artist" ON public.artist
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own artist" ON public.artist
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own artist" ON public.artist
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for album
CREATE POLICY "Users can view their own album" ON public.album
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own album" ON public.album
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own album" ON public.album
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own album" ON public.album
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for playlist
CREATE POLICY "Users can view their own playlist" ON public.playlist
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own playlist" ON public.playlist
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own playlist" ON public.playlist
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own playlist" ON public.playlist
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for track
CREATE POLICY "Users can view their own track" ON public.track
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own track" ON public.track
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own track" ON public.track
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own track" ON public.track
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for playlist_track
CREATE POLICY "Users can view their own playlist_track" ON public.playlist_track
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own playlist_track" ON public.playlist_track
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own playlist_track" ON public.playlist_track
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own playlist_track" ON public.playlist_track
    FOR DELETE USING (auth.uid() = user_id);
````

## PowerSync Schema

````yaml
buckets:
  global:
    parameters:
      - user_id
    data:
      - SELECT * FROM artist WHERE user_id = token_parameters.user_id
      - SELECT * FROM album WHERE user_id = token_parameters.user_id
      - SELECT * FROM playlist WHERE user_id = token_parameters.user_id
      - SELECT * FROM track WHERE user_id = token_parameters.user_id
      - SELECT * FROM playlist_track WHERE user_id = token_parameters.user_id

tables:
  artist:
    user_id: text
    name: text
    image_url: text
    created_at: text
    updated_at: text

  album:
    user_id: text
    artist_name: text
    title: text
    cover_image: text
    created_at: text
    updated_at: text

  playlist:
    user_id: text
    name: text
    description: text
    cover_image: text
    custom_cover_url: text
    custom_cover_type: text
    created_at: text
    updated_at: text

  track:
    id: text primary key
    user_id: text
    file_name: text
    file_path: text
    file_size: integer
    title: text
    artist: text
    album_artist: text
    album: text
    composer: text
    year: integer
    track_number: integer
    disc_number: integer
    genre: text
    duration: integer
    bitrate: integer
    sample_rate: integer
    mpeg_version: integer
    mpeg_layer: integer
    cover_image: text
    custom_cover_url: text
    custom_cover_type: text
    platform_source: text
    platform_track_id: text
    created_at: text
    updated_at: text
    last_played_at: text
    is_synced: integer

  playlist_track:
    user_id: text
    playlist_name: text
    track_id: text
    position: integer
    added_at: text
````

## TypeScript interfaces

````typescript
-- filepath: /Users/krishna/Dev/music-player/types/music.ts
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
  id?: string;
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
````
