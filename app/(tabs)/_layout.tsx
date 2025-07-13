import { BlurTabBar, FloatingMusicPlayer } from '@/components';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTranslation } from '@/hooks/useTranslation';
import { ThemeColors } from '@/types/colors';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function TabLayout() {
  const colors: ThemeColors = useThemeColors();
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={props => <BlurTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.onSurface,
          animation: 'fade',
          sceneStyle: {
            backgroundColor: colors.background,
          }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('common.home'),
          }}
        />
        <Tabs.Screen
          name="tracks"
          options={{
            title: t('common.tracks'),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: t('common.search'),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: t('common.library'),
          }}
        />
      </Tabs>
      <FloatingMusicPlayer />
    </View>
  );
}