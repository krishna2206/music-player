import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { useThemeColors } from '@/hooks/useThemeColors';
import { supabase } from '@/lib/supabase';
import { appStorageService } from '@/services/appStorageService';
import { PlaybackService } from '@/services/playbackService';
import { useAuthStore } from '@/stores/useAuthStore';
import { ThemeColors } from '@/types/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import TrackPlayer, { Capability } from 'react-native-track-player';
import '../global.css';

export { ErrorBoundary } from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'TangoSans-Bold': require('../assets/fonts/TangoSans-Bold.ttf'),
    'Manrope-Bold': require('../assets/fonts/Manrope-Bold.otf'),
    ...FontAwesome.font,
  });
  const { setSession } = useAuthStore();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Setup app storage (create necessary folders)
  useEffect(() => {
    async function setupAppStorage() {
      await appStorageService.setupAppStorage();
    }
    setupAppStorage();
  }, [])

  // Setup supabase event listeners
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [setSession])

  // Setup Google Auth
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID
    });
  }, [])

  // Setup react-native-track-player
  useEffect(() => {
    const setupPlayer = async () => {
      TrackPlayer.registerPlaybackService(() => PlaybackService);
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });
    };

    setupPlayer();
  }, []);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ThemeProvider>
      <ThemedNavigationStack />
    </ThemeProvider>
  );
}

function ThemedNavigationStack() {
  const colors: ThemeColors = useThemeColors();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  return (
    <>
      <RootStatusBar />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background
          },
        }}
      >
        <Stack.Screen
          name="onboarding/index"
          options={{
            animation: 'fade'
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </>
  );
}

function RootStatusBar() {
  const { isDark } = useTheme();

  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}
