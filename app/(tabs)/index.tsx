import { CustomHeader, ThemedText, ThemedView } from "@/components";
import { HeaderAction } from "@/components/CustomHeader";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { router } from "expo-router";
import { GearSix } from "phosphor-react-native";
import { ScrollView } from "react-native";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { user, session } = useAuth();

  const headerActions: HeaderAction[] = [
    {
      icon: GearSix,
      onPress: () => router.navigate('/settings'),
      testID: 'settings-button'
    }
  ];

  return (
    <ThemedView className="flex-1">
      <CustomHeader
        title={t('common.home')}
        actions={headerActions}
      />

      <ScrollView className="flex-1 p-4">
        <ThemedText className="text-center text-lg">
          Home content will go here
        </ThemedText>

        <ThemedText className="text-center text-lg">
          User : {JSON.stringify(user)}
        </ThemedText>
        <ThemedText className="text-center text-lg">
          Session : {JSON.stringify(session)}
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}