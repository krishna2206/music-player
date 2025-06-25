import React from 'react';
import { Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type ThemedButtonProps = React.ComponentProps<typeof Pressable> & {
  variant?: 'primary' | 'secondary' | 'surface' | 'always-white-bg';
  textClassName?: string;
  children: React.ReactNode;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ThemedButton({
  variant = 'primary',
  className = '',
  textClassName = '',
  children,
  ...props
}: ThemedButtonProps) {
  const opacity = useSharedValue(1);

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary';
      case 'secondary':
        return 'bg-secondary';
      case 'surface':
        return 'bg-surface border border-border';
      case 'always-white-bg':
        return 'bg-white';
      default:
        return 'bg-primary';
    }
  };

  const getTextClasses = () => {
    switch (variant) {
      case 'surface':
        return 'text-on-surface';
      case 'always-white-bg':
        return 'text-black';
      default:
        return 'text-on-primary';
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    opacity.value = withTiming(0.8, { duration: 150 });
  };

  const handlePressOut = () => {
    opacity.value = withTiming(1, { duration: 150 });
  };

  return (
    <AnimatedPressable
      className={`py-3 px-6 rounded-xl min-h-14 flex items-center justify-center ${getVariantClasses()} ${className}`}
      style={animatedStyle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text className={`font-medium text-lg ${getTextClasses()} ${textClassName}`}>
          {children}
        </Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
}