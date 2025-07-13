import { useTracksStore } from '@/stores/useTracksStore';
import { Track } from '@/types/music';
import { extractMetadata } from '@/utils/audio';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export interface ImportResult {
  imported: Track[];
  failed: string[];
  duplicates: string[];
}

class TrackService {
  private static instance: TrackService;
  private static tracksFolder: string = 'tracks/';

  public static getInstance(): TrackService {
    if (!TrackService.instance) {
      TrackService.instance = new TrackService();
    }
    return TrackService.instance;
  }

  async getMusicDirectory(): Promise<string> {
    return FileSystem.documentDirectory + TrackService.tracksFolder;
  }

  async openFilePicker(): Promise<DocumentPicker.DocumentPickerAsset[] | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (result.canceled) {
        return null;
      }

      return result.assets;
    } catch (error) {
      console.error("Failed to open file picker:", error);
      throw new Error("Failed to open file picker");
    }
  }

  async importTrack(file: DocumentPicker.DocumentPickerAsset): Promise<Track | null> {
    try {
      // Check if file already exists
      const fileName = this.generateFileName(file.name);
      const existingTrack = this.getTrackByFilename(fileName);
      if (existingTrack) {
        console.log(`Track already exists: ${fileName}`);
        return existingTrack;
      }

      // Import file
      const importedTrack = await this.importTrackFile(file);
      if (!importedTrack) {
        return null;
      }

      // Add to store
      const store = useTracksStore.getState();
      store.addTrack(importedTrack);

      console.log(`Track imported and added to store: ${importedTrack.file_name}`);
      return importedTrack;
    } catch (error) {
      console.error("Failed to import track:", error);
      return null;
    }
  }

  async importTracks(
    files: DocumentPicker.DocumentPickerAsset[],
    onProgress?: (current: number, total: number) => void
  ): Promise<ImportResult> {
    const imported: Track[] = [];
    const failed: string[] = [];
    const duplicates: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      onProgress?.(i + 1, files.length);

      // Check if file already exists
      const fileName = this.generateFileName(file.name);
      const existingTrack = this.getTrackByFilename(fileName);
      
      if (existingTrack) {
        duplicates.push(fileName);
        continue;
      }

      // Import track (file + store)
      const importedTrack = await this.importTrack(file);
      if (importedTrack) {
        imported.push(importedTrack);
      } else {
        failed.push(fileName);
      }
    }

    return { imported, failed, duplicates };
  }

  async deleteTrack(trackOrId: Track | string): Promise<boolean> {
    try {
      const store = useTracksStore.getState();
      const trackId = typeof trackOrId === 'string' ? trackOrId : trackOrId.id!;
      const track = store.getTrackById(trackId);

      if (!track) {
        console.warn(`Track not found: ${trackId}`);
        return false;
      }

      // Delete file
      const fileInfo = await FileSystem.getInfoAsync(track.file_path);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(track.file_path);
      }

      // Remove from store
      store.removeTrack(trackId);

      console.log(`Deleted track: ${track.file_name}`);
      return true;
    } catch (error) {
      console.error("Failed to delete track:", error);
      return false;
    }
  }

  private generateFileName(originalName?: string): string {
    return originalName || `track_${uuidv4()}.mp3`;
  }

  private async importTrackFile(file: DocumentPicker.DocumentPickerAsset): Promise<Track | null> {
    try {
      const musicDir = await this.getMusicDirectory();
      const fileName = this.generateFileName(file.name);
      const destinationPath = musicDir + fileName;

      // Copy file to app directory
      await FileSystem.copyAsync({
        from: file.uri,
        to: destinationPath,
      });

      // Extract metadata
      const metadata = await extractMetadata(destinationPath);

      // Create track object (without adding to store)
      const newTrack: Track = {
        id: uuidv4(),
        file_name: fileName,
        file_path: destinationPath,
        file_size: metadata.file_size,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_synced: false,
        platform_source: 'local',
        ...metadata,
      };

      console.log(`File imported: ${fileName} to ${destinationPath}`);
      return newTrack;
    } catch (error) {
      console.error("Failed to import track file:", error);
      return null;
    }
  }

  private getTrackByFilename(filename: string): Track | undefined {
    const store = useTracksStore.getState();
    return store.tracks.find(track => track.file_name === filename);
  }
}

export const trackService = TrackService.getInstance();