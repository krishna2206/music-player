import { useThemeColors } from '@/hooks/useThemeColors';
import React from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type ThemedIconButtonProps = React.ComponentProps<typeof Pressable> & {
  icon: React.ComponentType<any>;
  size?: number;
  className?: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function IconButton({
  icon: Icon,
  size = 24,
  className = '',
  ...props
}: ThemedIconButtonProps) {
  const colors = useThemeColors();
  const scale = useSharedValue(1);
  const backgroundColor = useSharedValue('transparent');

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: backgroundColor.value,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 150 });
    backgroundColor.value = withTiming(colors.surface, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
    backgroundColor.value = withTiming('transparent', { duration: 150 });
  };

  return (
    <AnimatedPressable
      className={`w-10 h-10 items-center justify-center rounded-full ${className}`}
      style={animatedStyle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      <Icon
        size={size}
        color={colors.primary}
        weight="regular"
      />
    </AnimatedPressable>
  );
}