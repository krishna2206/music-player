import { CustomHeader, ThemedText, ThemedView } from '@/components';
import type { HeaderAction } from '@/components/CustomHeader';
import { useTranslation } from '@/hooks/useTranslation';
import { FunnelSimple, GridFour } from 'phosphor-react-native';
import React from 'react';
import { ScrollView } from 'react-native';

export default function LibraryScreen() {
  const { t } = useTranslation();

  const headerActions: HeaderAction[] = [
    {
      icon: FunnelSimple,
      onPress: () => console.log('Filter library'),
      testID: 'filter-button'
    },
    {
      icon: GridFour,
      onPress: () => console.log('Change view'),
      testID: 'view-button'
    }
  ];

  return (
    <ThemedView className="flex-1">
      <CustomHeader
        title={t('common.library')}
        actions={headerActions}
      />

      <ScrollView className="flex-1 p-4">
        <ThemedText className="text-center text-lg">
          Library content will go here
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}