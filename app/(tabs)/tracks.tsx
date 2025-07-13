import { router } from "expo-router";
import { GearSix, Plus, SortAscending } from 'phosphor-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, View } from 'react-native';

import { CustomHeader, FadeInAnimated, ThemedText, ThemedView, TrackCard } from '@/components';
import type { HeaderAction } from '@/components/CustomHeader';
import useMusicPlayer from '@/hooks/useMusicPlayer';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTracks } from '@/hooks/useTracks';
import { useTranslation } from '@/hooks/useTranslation';
import { ImportResult, trackService } from '@/services/trackService';
import { Track } from '../../types/music';

export default function TracksScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { tracks } = useTracks();
  const { playTrack } = useMusicPlayer();

  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });

  const handleTrackClick = async (track: Track) => {
    try {
      await playTrack(track, tracks);
    } catch (error) {
      console.error('Error playing track:', error);
      Alert.alert('Error', 'Failed to play track');
    }
  };

  const showImportResult = (result: ImportResult) => {
    if (result.failed.length > 0) {
      Alert.alert(
        'Import Completed',
        `${result.imported.length} tracks imported successfully.\n${result.failed.length} tracks failed to import.`
      );
    } else if (result.duplicates.length > 0) {
      Alert.alert(
        'Import Completed',
        `${result.imported.length} new tracks imported.\n${result.duplicates.length} duplicates were skipped.`
      );
    } else {
      Alert.alert('Success', 'All music files imported successfully!');
    }
  };

  const importMusicFile = async () => {
    try {
      const files = await trackService.openFilePicker();
      if (!files) return;

      setIsImporting(true);
      setImportProgress({ current: 0, total: files.length });

      const importResult = await trackService.importTracks(
        files,
        (current, total) => {
          setImportProgress({ current, total });
        }
      );

      showImportResult(importResult);
    } catch (error) {
      console.error('Error during import:', error);
      Alert.alert('Error', 'An error occurred during import');
    } finally {
      setIsImporting(false);
      setTimeout(() => {
        setImportProgress({ current: 0, total: 0 });
      }, 300);
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

  const renderLoadingModal = () => (
    <Modal
      visible={isImporting}
      transparent={true}
      animationType="fade"
    >
      <View className="flex-1 justify-center items-center">
        <ThemedView className="bg-surface p-6 rounded-xl items-center min-w-[300px] border border-border/50">
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText className="mt-4 text-center font-medium">
            Importing tracks...
          </ThemedText>
          <ThemedText className="mt-2 text-center text-sm">
            {importProgress.current} of {importProgress.total}
          </ThemedText>
        </ThemedView>
      </View>
    </Modal>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center p-4">
      <ThemedText className="text-center text-lg text-gray-500">
        No tracks imported yet. Tap the + button to add music files.
      </ThemedText>
    </View>
  );

  const renderTracksList = () => (
    <ScrollView className="flex-1 p-4">
      <FadeInAnimated duration={300}>
        <View className="space-y-2">
          <View className="flex-row flex-wrap justify-between">
            {tracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onPress={() => handleTrackClick(track)}
              />
            ))}
          </View>
          <View style={{ height: 100 }} />
        </View>
      </FadeInAnimated>
    </ScrollView>
  );

  return (
    <ThemedView className="flex-1">
      <CustomHeader
        title={t('common.tracks')}
        actions={headerActions}
      />

      {renderLoadingModal()}

      {tracks.length === 0 ? renderEmptyState() : renderTracksList()}
    </ThemedView>
  );
}