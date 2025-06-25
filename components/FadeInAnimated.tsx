import React, { useCallback, useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type FadeDirection = 'none' | 'up' | 'down' | 'left' | 'right';

interface FadeInAnimatedProps {
  children: React.ReactNode;
  direction?: FadeDirection;
  duration?: number;
  delay?: number;
  distance?: number;
  style?: ViewStyle;
  onAnimationComplete?: () => void;
  trigger?: boolean; // Manual trigger for animation
}

export function FadeInAnimated({
  children,
  direction = 'none',
  duration = 600,
  delay = 0,
  distance = 30,
  style,
  onAnimationComplete,
  trigger = true,
}: FadeInAnimatedProps) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(direction === 'left' ? -distance : direction === 'right' ? distance : 0);
  const translateY = useSharedValue(direction === 'up' ? distance : direction === 'down' ? -distance : 0);

  const startAnimation = useCallback(() => {
    const config = {
      duration,
      easing: Easing.out(Easing.cubic),
    };

    opacity.value = withTiming(1, config);
    translateX.value = withTiming(0, config);
    translateY.value = withTiming(0, config, () => {
      if (onAnimationComplete) {
        runOnJS(onAnimationComplete)();
      }
    });
  }, [duration, opacity, translateX, translateY, onAnimationComplete]);

  useEffect(() => {
    if (trigger) {
      if (delay > 0) {
        const timeout = setTimeout(startAnimation, delay);
        return () => clearTimeout(timeout);
      } else {
        startAnimation();
      }
    }
  }, [trigger, delay, startAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}