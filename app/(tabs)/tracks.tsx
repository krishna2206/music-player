import { CustomHeader, FadeInAnimated, LoadingSpinner, ThemedText, ThemedView, TrackCard } from '@/components';
import type { HeaderAction } from '@/components/CustomHeader';
import { useTranslation } from '@/hooks/useTranslation';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { router } from "expo-router";
import { GearSix, Plus, SortAscending } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { getPictureAsDataURL, readAudioFile } from 'taglib-ts';
import { Track } from '../../types/music';

export default function TracksScreen() {
  const { t } = useTranslation();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  const extractMetadata = async (filePath: string): Promise<Partial<Track>> => {
    try {
      const fileRef = await readAudioFile(filePath);

      if (fileRef.isValid()) {
        const tag = fileRef.tag();
        const audioProps = fileRef.audioProperties();
        const pictures = tag?.pictures() || [];

        return {
          title: tag?.title() || undefined,
          artist: tag?.artist() || undefined,
          album: tag?.album() || undefined,
          year: tag?.year() || undefined,
          track_number: tag?.track() || undefined,
          genre: tag?.genre() || undefined,
          duration: audioProps?.lengthInSeconds() || undefined,
          cover_image: pictures.length > 0 ? getPictureAsDataURL(pictures[0]) : undefined,
        };
      }
    } catch (error) {
      console.error('Error extracting metadata:', error);
    }

    return {};
  };

  const loadMusicFiles = async () => {
    try {
      setLoading(true);
      const musicDir = FileSystem.documentDirectory + 'music/';
      const dirInfo = await FileSystem.getInfoAsync(musicDir);

      if (dirInfo.exists) {
        const files = await FileSystem.readDirectoryAsync(musicDir);
        const tracksWithMetadata: Track[] = [];

        for (const fileName of files) {
          const filePath = musicDir + fileName;
          const metadata = await extractMetadata(filePath);

          tracksWithMetadata.push({
            file_name: fileName,
            file_path: filePath,
            ...metadata,
          });
        }

        setTracks(tracksWithMetadata);
      }
    } catch (error) {
      console.error('Error loading music files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadFiles = async () => {
      try {
        setLoading(true);
        const musicDir = FileSystem.documentDirectory + 'music/';
        const dirInfo = await FileSystem.getInfoAsync(musicDir);

        if (dirInfo.exists) {
          const files = await FileSystem.readDirectoryAsync(musicDir);
          const tracksWithMetadata: Track[] = [];

          for (const fileName of files) {
            const filePath = musicDir + fileName;
            const metadata = await extractMetadata(filePath);

            tracksWithMetadata.push({
              file_name: fileName,
              file_path: filePath,
              ...metadata,
            });
          }

          setTracks(tracksWithMetadata);
        }
      } catch (error) {
        console.error('Error loading music files:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, []);

  const importMusicFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled) {
        for (const file of result.assets) {
          // Create a directory for music files if it doesn't exist
          const musicDir = FileSystem.documentDirectory + 'music/';
          const dirInfo = await FileSystem.getInfoAsync(musicDir);

          if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(musicDir, { intermediates: true });
          }

          // Copy file to app's document directory
          const fileName = file.name || `track_${Date.now()}.mp3`;
          const destinationPath = musicDir + fileName;

          await FileSystem.copyAsync({
            from: file.uri,
            to: destinationPath,
          });

          console.log(`Imported: ${fileName} to ${destinationPath}`);
        }

        Alert.alert('Success', 'Music files imported successfully!');
        // Reload the music files list
        loadMusicFiles();
      }
    } catch (error) {
      console.error('Error importing music file:', error);
      Alert.alert('Error', 'Failed to import music file');
    }
  };

  const headerActions: HeaderAction[] = [
    {
      icon: SortAscending,
      onPress: () => console.log('Sort tracks'),
      testID: 'sort-button'
    },
    {
      icon: Plus,
      onPress: importMusicFile,
      testID: 'add-button'
    },
    {
      icon: GearSix,
      onPress: () => router.navigate('/settings'),
      testID: 'settings-button'
    }
  ];

  if (loading) {
    return (
      <>
        <CustomHeader
          title={t('common.tracks')}
          actions={headerActions}
        />
        <LoadingSpinner usedInTabScreen={true} />
      </>
    )
  }

  else if (tracks.length === 0) {
    return (
      <ThemedText className="text-center text-lg text-gray-500">
        No tracks imported yet. Tap the + button to add music files.
      </ThemedText>
    )
  }

  return (
    <ThemedView className="flex-1">
      <CustomHeader
        title={t('common.tracks')}
        actions={headerActions}
      />

      <ScrollView className="flex-1 p-4">
        <FadeInAnimated duration={300}>
          <View className="space-y-2">
            <View className="flex-row flex-wrap justify-between">
              {tracks.map((track, index) => (
                <TrackCard
                  key={index}
                  track={track}
                  onPress={() => console.log('Play:', track.title)}
                />
              ))}
            </View>
          </View>
        </FadeInAnimated>
      </ScrollView>
    </ThemedView>
  );
}