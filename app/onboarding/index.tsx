import { FadeInAnimated, ThemedButton, ThemedText } from '@/components';
import { useTranslation } from '@/hooks/useTranslation';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Image as RNImage, StyleSheet, View } from 'react-native';

export default function OnboardingScreen() {
  const { t } = useTranslation();

  const welcomeImages = useMemo(() => [
    require('@/assets/images/welcome-bg.png'),
    require('@/assets/images/welcome-bg-1.png'),
    require('@/assets/images/welcome-bg-2.png'),
    require('@/assets/images/welcome-bg-3.png'),
    require('@/assets/images/welcome-bg-4.png'),
  ], []);

  const backgroundImage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * welcomeImages.length);
    return welcomeImages[randomIndex];
  }, [welcomeImages]);

  // Preload all images
  useEffect(() => {
    const preloadImages = async () => {
      try {
        const imageUris = welcomeImages.map(img => RNImage.resolveAssetSource(img).uri);
        await Image.prefetch(imageUris, 'disk');
      } catch (error) {
        console.warn('Failed to preload images:', error);
      }
    };

    preloadImages();
  }, [welcomeImages]);

  const handleContinue = () => {
    router.push('/onboarding/connect');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={backgroundImage}
          style={styles.backgroundImage}
          contentFit="cover"
          transition={{
            duration: 800,
            effect: 'cross-dissolve',
            timing: 'ease-in-out'
          }}
          cachePolicy="disk"
        />
      </View>

      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,1)']}
        style={styles.gradientOverlay}
        locations={[0, 0.6, 1]}
      >
        <View style={styles.contentContainer}>
          <FadeInAnimated direction="up" delay={200} duration={800}>
            <ThemedText style={styles.title}>
              {t('onboarding.welcome')}
            </ThemedText>
          </FadeInAnimated>

          <FadeInAnimated direction="up" delay={400} duration={800}>
            <ThemedText style={styles.subtitle}>
              {t('onboarding.subtitle')}
            </ThemedText>
          </FadeInAnimated>

          <FadeInAnimated direction="up" delay={800} duration={600}>
            <ThemedButton
              onPress={handleContinue}
              variant="always-white-bg"
            >
              {t('onboarding.getStarted')}
            </ThemedButton>
          </FadeInAnimated>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(0,0,0)',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '80%',
    zIndex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 50,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'left',
    marginBottom: 32,
    lineHeight: 22,
  },
  featuresContainer: {
    marginBottom: 40,
    gap: 16,
  },
  featureText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'left',
    marginLeft: 8,
  },
});