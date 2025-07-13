import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Music Player App",
  slug: "music-player-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "music-player-app",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
    dark: {
      backgroundColor: "#111827"
    }
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "mg.krishna.musicplayer",
    appleTeamId: "JY5BRV4N92",
    infoPlist: {
      UIBackgroundModes: [
        "audio"
      ]
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true,
    package: "mg.krishna.musicplayer"
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router",
    "expo-localization",
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme: process.env.EXPO_PUBLIC_IOS_URL_SCHEME
      }
    ],
    "expo-audio"
  ],
  experiments: {
    typedRoutes: true
  }
});