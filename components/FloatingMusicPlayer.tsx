import useMusicPlayer from '@/hooks/useMusicPlayer';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Pause, Play, SkipBack, SkipForward } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Image, Platform, Pressable, View } from 'react-native';
import { getColors } from 'react-native-image-colors';
import { AndroidImageColors, ImageColorsResult, IOSImageColors } from 'react-native-image-colors/build/types';
import { FadeInAnimated } from './FadeInAnimated';
import { ThemedText } from './ThemedText';

interface ExtractedColors {
  background: string;
  primary: string;
  text: string;
  textSecondary: string;
}

export function FloatingMusicPlayer() {
  const colors = useThemeColors();
  const { isPlaying, currentTrack, progress, togglePlayPause, skipToNext, skipToPrevious } = useMusicPlayer();
  const [extractedColors, setExtractedColors] = useState<ExtractedColors | null>(null);

  // Extract colors from current track's artwork
  useEffect(() => {
    if (currentTrack?.artwork) {
      getColors(currentTrack.artwork, {
        fallback: colors.surface,
        cache: true,
        key: currentTrack.id || currentTrack.url,
        quality: 'low'
      })
        .then((result: ImageColorsResult) => {
          let backgroundColor: string;
          let primaryColor: string;
          let textColor: string;
          let textSecondaryColor: string;

          if (Platform.OS === 'ios') {
            const iosResult = result as IOSImageColors;
            backgroundColor = iosResult.background;
            primaryColor = iosResult.primary || iosResult.detail;
            textColor = iosResult.primary || iosResult.detail;
            textSecondaryColor = iosResult.secondary || textColor;
          } else {
            const androidResult = result as AndroidImageColors;
            backgroundColor = androidResult.vibrant || androidResult.dominant;
            primaryColor = androidResult.vibrant || androidResult.darkVibrant || androidResult.dominant;
            textColor = androidResult.darkVibrant || androidResult.lightMuted || '#FFFFFF';
            textSecondaryColor = androidResult.darkMuted || androidResult.muted || textColor;
          }

          setExtractedColors({
            background: backgroundColor,
            primary: primaryColor,
            text: textColor,
            textSecondary: textSecondaryColor
          });
        })
        .catch(() => {
          // Fallback to theme colors if extraction fails
          setExtractedColors({
            background: colors.surface,
            primary: colors.primary,
            text: colors.primary,
            textSecondary: colors.primary
          });
        });
    } else {
      // No artwork, use theme colors
      setExtractedColors({
        background: colors.surface,
        primary: colors.primary,
        text: colors.primary,
        textSecondary: colors.primary
      });
    }
  }, [currentTrack?.artwork, currentTrack?.id, currentTrack?.url, colors]);

  const handlePlayPause = async () => {
    try {
      await togglePlayPause();
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleSkipToNext = async () => {
    try {
      await skipToNext();
    } catch (error) {
      console.error('Error skipping to next:', error);
    }
  };

  const handleSkipToPrevious = async () => {
    try {
      await skipToPrevious();
    } catch (error) {
      console.error('Error skipping to previous:', error);
    }
  };

  // Don't show player if no track is loaded
  if (!currentTrack) {
    return null;
  }

  const currentColors = extractedColors || {
    background: colors.surface,
    primary: colors.primary,
    text: colors.primary,
    textSecondary: colors.primary
  };

  return (
    <FadeInAnimated direction='up' duration={200} delay={200}>
      <View
        className="absolute left-1 right-1 rounded-xl overflow-hidden shadow-lg"
        style={{
          bottom: 100, // Above tab bar
          backgroundColor: currentColors.background,
        }}
      >
        {/* Progress bar */}
        <View
          className="h-1"
          style={{ backgroundColor: currentColors.primary + '30' }}
        >
          <View
            className="h-full"
            style={{
              backgroundColor: currentColors.primary,
              width: `${progress.duration > 0 ? (progress.position / progress.duration) * 100 : 0}%`
            }}
          />
        </View>

        <View className="flex-row items-center px-3 py-2">
          {/* Album art */}
          <View className="w-12 h-12 rounded-lg overflow-hidden mr-3">
            {currentTrack.artwork ? (
              <Image
                source={{ uri: currentTrack.artwork }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View
                className="w-full h-full items-center justify-center"
                style={{ backgroundColor: currentColors.primary + '20' }}
              >
                <ThemedText className="text-xs" style={{ color: currentColors.primary }}>
                  MP3
                </ThemedText>
              </View>
            )}
          </View>

          {/* Track info */}
          <View className="flex-1 mr-3">
            <ThemedText
              className="font-bold"
              numberOfLines={1}
              style={{ color: currentColors.text }}
            >
              {currentTrack.title || 'Unknown Track'}
            </ThemedText>
            <ThemedText
              className="text-sm"
              numberOfLines={1}
              style={{ color: currentColors.text, opacity: 0.8 }}
            >
              {currentTrack.artist || 'Unknown Artist'}
            </ThemedText>
          </View>

          {/* Controls */}
          <View className="flex-row items-center space-x-2">
            <Pressable onPress={handleSkipToPrevious}>
              <SkipBack
                size={24}
                color={currentColors.text}
                weight="fill"
              />
            </Pressable>

            <Pressable
              onPress={handlePlayPause}
              className="w-10 h-10 mx-2 rounded-full items-center justify-center"
              style={{ backgroundColor: currentColors.text }}
            >
              {isPlaying ? (
                <Pause size={20} color={currentColors.background} weight="fill" />
              ) : (
                <Play size={20} color={currentColors.background} weight="fill" />
              )}
            </Pressable>

            <Pressable onPress={handleSkipToNext}>
              <SkipForward
                size={24}
                color={currentColors.text}
                weight="fill"
              />
            </Pressable>
          </View>
        </View>
      </View>
    </FadeInAnimated>
  );
}