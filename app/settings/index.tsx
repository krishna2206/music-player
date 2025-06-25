import { ThemedButton, ThemedCard, ThemedText, ThemedView } from "@/components";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/lib/supabase";
import { useAppStateStore } from "@/stores/useAppStateStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import * as Updates from 'expo-updates';
import { ArrowLeft } from "phosphor-react-native";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme, setColorScheme } = useTheme();
  const colors = useThemeColors();
  const { isAuthenticated } = useAuth()
  const { t, language, isSystemLanguage, setLanguage, setSystemLanguage } = useTranslation();
  const { resetOnboarding } = useAppStateStore();

  const handleGoBack = () => {
    router.back()
  }

  const getLanguageDisplayName = () => {
    if (isSystemLanguage) {
      return t('settings.systemLanguage');
    }
    return language === 'en' ? 'English' : 'Français';
  };

  const getLanguageSource = () => {
    return isSystemLanguage ? t('settings.systemLanguage') : t('settings.currentLanguage', { language: getLanguageDisplayName() });
  };

  const handleResetOnboarding = () => {
    resetOnboarding();
    router.replace('/onboarding');
  };

  const handleClearAppData = async () => {
    await AsyncStorage.clear();

    Alert.alert(
      "Message",
      "App data cleared !",
      [
        {
          text: "OK",
          onPress: async () => await Updates.reloadAsync()
        },
      ]
    );
  }

  const handleLogout = async () => {
    await GoogleSignin.signOut();
    const error = await supabase.auth.signOut();
    console.log(error);
    Alert.alert("Message", "Log out complete");
  }

  return (
    <ThemedView className="flex-1">
      <TouchableOpacity
        className="absolute left-4 z-10 p-2"
        style={{ top: insets.top + 8 }}
        onPress={handleGoBack}
      >
        <ArrowLeft size={24} color={colors.primary} />
      </TouchableOpacity>

      <ScrollView
        className="flex-1 flex-col"
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: insets.top + 60,
          paddingBottom: insets.bottom + 20
        }}
        showsVerticalScrollIndicator={false}
      >
        <ThemedCard className="w-full max-w-sm mb-6">
          <ThemedText className="font-semibold mb-4 text-center">
            {t('settings.themeSettings')}
          </ThemedText>

          <ThemedButton
            variant={colorScheme === 'light' ? 'primary' : 'surface'}
            onPress={() => setColorScheme('light')}
            className="mb-3"
          >
            {t('settings.lightTheme')}
          </ThemedButton>

          <ThemedButton
            variant={colorScheme === 'dark' ? 'primary' : 'surface'}
            onPress={() => setColorScheme('dark')}
            className="mb-3"
          >
            {t('settings.darkTheme')}
          </ThemedButton>

          <ThemedButton
            variant={colorScheme === 'system' ? 'primary' : 'surface'}
            onPress={() => setColorScheme('system')}
            className="mb-4"
          >
            {t('settings.systemDefault')}
          </ThemedButton>

          <ThemedText className="text-on-surface-variant text-center text-sm">
            {t('settings.currentTheme', { theme: colorScheme })}
          </ThemedText>
        </ThemedCard>

        <ThemedCard className="w-full max-w-sm mb-6">
          <ThemedText className="font-semibold mb-4 text-center">
            {t('settings.languageSettings')}
          </ThemedText>

          <ThemedButton
            variant={isSystemLanguage ? 'primary' : 'surface'}
            onPress={() => setSystemLanguage()}
            className="mb-3"
          >
            {t('settings.systemLanguage')}
          </ThemedButton>

          <ThemedButton
            variant={!isSystemLanguage && language === 'en' ? 'primary' : 'surface'}
            onPress={() => setLanguage('en')}
            className="mb-3"
          >
            {t('settings.english')}
          </ThemedButton>

          <ThemedButton
            variant={!isSystemLanguage && language === 'fr' ? 'primary' : 'surface'}
            onPress={() => setLanguage('fr')}
            className="mb-4"
          >
            {t('settings.french')}
          </ThemedButton>

          <ThemedText className="text-on-surface-variant text-center text-sm">
            {getLanguageSource()}
            {isSystemLanguage && (
              <ThemedText className="text-on-surface-variant text-center text-xs mt-1">
                ({language === 'en' ? 'English' : 'Français'})
              </ThemedText>
            )}
          </ThemedText>
        </ThemedCard>

        <ThemedCard className="w-full max-w-sm">
          <ThemedText className="font-semibold mb-4 text-center">
            Development
          </ThemedText>

          <ThemedButton
            variant="surface"
            onPress={handleResetOnboarding}
            className="mb-3"
          >
            {t('settings.resetOnboarding')}
          </ThemedButton>

          <ThemedButton
            variant="surface"
            onPress={handleClearAppData}
            className="mb-3"
          >
            {t('settings.clearAppData')}
          </ThemedButton>

          {
            isAuthenticated && (
              <ThemedButton
                variant="surface"
                onPress={handleLogout}
                className="mb-3"
              >
                {t('settings.logout')}
              </ThemedButton>
            )
          }
        </ThemedCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ThemedView>
  );
}