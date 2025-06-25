import { useAppStateStore } from '@/stores/useAppStateStore';
import { Redirect } from 'expo-router';

export default function IndexScreen() {
  const { hasCompletedOnboarding, lastActiveTab } = useAppStateStore();

  if (hasCompletedOnboarding) {
    return <Redirect href={lastActiveTab} />;
  }

  return <Redirect href="/onboarding" />;
}