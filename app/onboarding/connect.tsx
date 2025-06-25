import { FadeInAnimated, ThemedButton, ThemedText, ThemedView } from '@/components';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/lib/supabase';
import { useAppStateStore } from '@/stores/useAppStateStore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { AppleLogo, ArrowLeft, ArrowRight, GoogleLogo } from 'phosphor-react-native';
import { Alert, TouchableOpacity, View } from 'react-native';


export default function ConnectScreen() {
  const { completeOnboarding } = useAppStateStore();
  const { t } = useTranslation();
  const colors = useThemeColors();

  const handleGoBack = () => {
    router.back();
  };

  const handleAppleConnect = () => {
    // TODO: Implement Apple connection
  };

  const handleGoogleConnect = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.data?.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken(
          {
            provider: 'google',
            token: userInfo.data.idToken,
          }
        )
        console.log(error, data)
        Alert.alert(
          "Message",
          `Authentication terminated :\ndata : ${JSON.stringify(data)}\nerror : ${error}`,
          [
            {
              text: 'Okay',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        )
      }
      else {
        throw new Error('no ID token present!')
      }
    } catch (error) {
      console.error("Failed to signin to Google : ", error);
    }
  }

  const handleOfflineMode = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <ThemedView className="flex-1 justify-center">
      <TouchableOpacity className="absolute top-14 left-4 z-10 p-2" onPress={handleGoBack}>
        <ArrowLeft size={24} color={colors.primary} />
      </TouchableOpacity>

      <View className="px-6 py-10">
        <FadeInAnimated direction="up" delay={200} duration={800}>
          <ThemedText className="text-3xl font-bold text-center mb-4">
            {t('onboarding.connectTitle')}
          </ThemedText>
        </FadeInAnimated>

        <FadeInAnimated direction="up" delay={400} duration={800}>
          <ThemedText className="text-lg/80 text-center mb-12 leading-6">
            {t('onboarding.connectSubtitle')}
          </ThemedText>
        </FadeInAnimated>

        <View className="gap-4">
          <FadeInAnimated direction="up" delay={600} duration={600}>
            <ThemedButton
              onPress={handleAppleConnect}
              variant="primary"
            >
              <View className="flex-row items-center">
                <View className="w-12 items-center mr-2">
                  <AppleLogo size={24} color={colors.onPrimary} weight="fill" />
                </View>
                <View className="flex-1 items-left">
                  <ThemedText className="text-on-primary font-semibold">
                    {t('onboarding.connectApple')}
                  </ThemedText>
                </View>
                <View className="w-12" />
              </View>
            </ThemedButton>
          </FadeInAnimated>

          <FadeInAnimated direction="up" delay={800} duration={600}>
            <ThemedButton
              onPress={handleGoogleConnect}
              variant="primary"
            >
              <View className="flex-row items-center">
                <View className="w-12 items-center mr-2">
                  <GoogleLogo size={24} color={colors.onPrimary} weight="bold" />
                </View>
                <View className="flex-1 items-left">
                  <ThemedText className="text-on-primary font-semibold">
                    {t('onboarding.connectGoogle')}
                  </ThemedText>
                </View>
                <View className="w-12" />
              </View>
            </ThemedButton>
          </FadeInAnimated>

          {/* Separator line */}
          <FadeInAnimated delay={1000} duration={600}>
            <View className="h-px bg-primary/30 mx-2 my-6" />
          </FadeInAnimated>

          <FadeInAnimated direction="up" delay={1000} duration={600}>
            <ThemedButton
              onPress={handleOfflineMode}
              variant="primary"
            >
              <View className="flex-row items-center">
                <View className="w-12 items-center mr-2">
                  <ArrowRight size={24} color={colors.onPrimary} weight="bold" />
                </View>
                <View className="flex-1 items-left">
                  <ThemedText className="text-on-primary font-medium">
                    {t('onboarding.goOffline')}
                  </ThemedText>
                </View>
                <View className="w-12" />
              </View>
            </ThemedButton>
          </FadeInAnimated>
        </View>
      </View>
    </ThemedView>
  );
}