import React from 'react';
import { ActivityIndicator } from 'react-native';
import { ThemedView } from './index';

interface LoadingSpinnerProps {
  usedInTabScreen?: boolean;
}

export function LoadingSpinner({
  usedInTabScreen: tabView = false
}: LoadingSpinnerProps) {
  return (
    <ThemedView className="flex-1 justify-center items-center">
      <ActivityIndicator
        size="large"
        className={`text-primary ${tabView ? 'mb-32' : ''}`}
      />
    </ThemedView>
  );
}