import { useThemeColors } from '@/hooks/useThemeColors';
import { DotsThreeOutlineVertical } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Image, Platform, Pressable, View } from 'react-native';
import ContextMenu from 'react-native-context-menu-view';
import { getColors } from 'react-native-image-colors';
import { AndroidImageColors, ImageColorsResult, IOSImageColors } from 'react-native-image-colors/build/types';
import { Track } from '../types/music';
import { ThemedText } from './ThemedText';

interface TrackCardProps {
  track: Track;
  onPress?: () => void;
  onContextMenuPress?: (action: string) => void;
}

interface ExtractedColors {
  background: string;
  text: string;
}

export function TrackCard({
  track,
  onPress,
  onContextMenuPress
}: TrackCardProps) {
  const colors = useThemeColors();
  const [extractedColors, setExtractedColors] = useState<ExtractedColors | null>(null);
  const displayName = track.title || track.file_name.replace(/\.[^/.]+$/, '');
  const fileExtension = track.file_name.split('.').pop()?.toUpperCase();

  // Extract colors from cover image
  useEffect(() => {
    if (track.cover_image) {
      getColors(track.cover_image, {
        fallback: colors.surface,
        cache: true,
        key: track.id || track.file_path,
        quality: 'low'
      })
        .then((result: ImageColorsResult) => {
          let backgroundColor: string;
          let textColor: string;

          if (Platform.OS === 'ios') {
            const iosResult = result as IOSImageColors;
            backgroundColor = iosResult.background;
            // Use primary color for text, fallback to detail
            textColor = iosResult.primary || iosResult.detail;
          } else if (Platform.OS === 'android') {
            const androidResult = result as AndroidImageColors;
            // Use vibrant color for background, fallback to dominant
            backgroundColor = androidResult.vibrant || androidResult.dominant;
            // Use light vibrant for text contrast, fallback to light muted
            textColor = androidResult.lightVibrant || androidResult.lightMuted || '#FFFFFF';
          } else {
            // Web platform - treat as Android-like
            const webResult = result as AndroidImageColors;
            backgroundColor = webResult.vibrant || webResult.dominant;
            textColor = webResult.lightVibrant || webResult.lightMuted || '#FFFFFF';
          }

          setExtractedColors({
            background: backgroundColor,
            text: textColor
          });
        })
        .catch(() => {
          // Fallback to theme colors if extraction fails
          setExtractedColors({
            background: colors.surface,
            text: colors.primary
          });
        });
    } else {
      // No cover image, use theme colors
      setExtractedColors({
        background: colors.surface,
        text: colors.primary
      });
    }
  }, [track.cover_image, track.id, track.file_path, colors.surface, colors.primary]);

  const contextMenuActions = [
    { title: 'Add to Playlist', titleColor: colors.primary, systemIcon: 'plus' },
    { title: 'Add to Queue', titleColor: colors.primary, systemIcon: 'list.bullet' },
    { title: 'Share', titleColor: colors.primary, systemIcon: 'square.and.arrow.up' },
    { title: 'View Details', titleColor: colors.primary, systemIcon: 'info.circle' },
    { title: 'Delete', systemIcon: 'trash', destructive: true }
  ];

  const handleContextMenuPress = (e: any) => {
    const actionName = e.nativeEvent.name;
    onContextMenuPress?.(actionName);
  };

  const renderCard = () => {
    const cardContent = (
      <Pressable
        className="rounded-2xl overflow-hidden h-80 mb-3"
        style={[
          Platform.OS === 'android' ? { width: '48.5%' } : {},
          {
            backgroundColor: extractedColors?.background || colors.surface
          }
        ]}
        onPress={onPress}
      >
        {/* Cover Image */}
        <View className="w-full h-60">
          {track.cover_image ? (
            <Image
              source={{ uri: track.cover_image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View
              className="w-full h-full flex items-center justify-center"
              style={{
                backgroundColor: extractedColors?.background || colors.surface
              }}
            >
              <ThemedText
                className="text-xs"
                style={{
                  color: extractedColors?.text || colors.onSurface
                }}
              >
                {fileExtension}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Track Info */}
        <View className="px-4 py-2 flex-row items-center justify-between">
          <View className="flex-1 mr-2">
            <ThemedText
              className="text-lg font-bold mb-1"
              numberOfLines={1}
              style={{
                color: extractedColors?.text || colors.primary
              }}
            >
              {displayName}
            </ThemedText>

            {track.artist && (
              <ThemedText
                numberOfLines={1}
                style={{
                  color: extractedColors?.text || colors.primary,
                  opacity: 0.8
                }}
              >
                {track.artist}
              </ThemedText>
            )}
          </View>

          {Platform.OS === 'android' && (
            <ContextMenu
              actions={contextMenuActions}
              onPress={handleContextMenuPress}
              dropdownMenuMode={true}
            >
              <Pressable>
                <DotsThreeOutlineVertical
                  size={20}
                  color={extractedColors?.text || colors.primary}
                  weight='fill'
                />
              </Pressable>
            </ContextMenu>
          )}
        </View>
      </Pressable>
    );

    return cardContent;
  };

  if (Platform.OS === 'ios') {
    return (
      <ContextMenu
        actions={contextMenuActions}
        onPress={handleContextMenuPress}
        style={{ width: '48.5%' }}
      >
        {renderCard()}
      </ContextMenu>
    );
  }

  return (
    <>
      {renderCard()}
    </>
  );
}