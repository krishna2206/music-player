import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from './IconButton';
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
              <IconButton
                key={index}
                icon={action.icon}
                onPress={action.onPress}
                testID={action.testID}
                className="ml-1"
              />
            ))}
          </View>
        )}
      </View>
    </ThemedView>
  );
}