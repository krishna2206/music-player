import { CustomHeader, ThemedText, ThemedView } from '@/components';
import type { HeaderAction } from '@/components/CustomHeader';
import { useTranslation } from '@/hooks/useTranslation';
import { Microphone } from 'phosphor-react-native';
import React from 'react';
import { ScrollView } from 'react-native';

export default function SearchScreen() {
  const { t } = useTranslation();

  const headerActions: HeaderAction[] = [
    {
      icon: Microphone,
      onPress: () => console.log('Voice search'),
      testID: 'voice-search-button'
    },
  ];

  return (
    <ThemedView className="flex-1">
      <CustomHeader
        title={t('common.search')}
        actions={headerActions}
      />

      <ScrollView className="flex-1 p-4">
        <ThemedText className="text-center text-lg">
          Search content will go here
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}