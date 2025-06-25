import { useThemeColors } from '@/hooks/useThemeColors';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export interface HeaderAction {
  icon: React.ComponentType<any>;
  onPress: () => void;
  testID?: string;
}

interface CustomHeaderProps {
  title: string;
  actions?: HeaderAction[];
}

export function CustomHeader({ title, actions = [] }: CustomHeaderProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center justify-between px-4 py-3">
        <ThemedText className="text-2xl font-bold flex-1">
          {title}
        </ThemedText>

        {actions.length > 0 && (
          <View className="flex-row items-center ml-2">
            {actions.map((action, index) => (
              <Pressable
                key={index}
                onPress={action.onPress}
                testID={action.testID}
                className="w-10 h-10 items-center justify-center rounded-full ml-1"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  backgroundColor: pressed ? colors.surface : 'transparent',
                })}
              >
                <action.icon
                  size={24}
                  color={colors.onBackground}
                  weight="regular"
                />
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </ThemedView>
  );
}