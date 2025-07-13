import { useAppStateStore } from "@/stores/useAppStateStore";

export function useAppState() {
  const { 
    hasCompletedOnboarding, lastActiveTab, isLoading,
    completeOnboarding, setLastActiveTab, setLoading
  } = useAppStateStore();

  return {
    hasCompletedOnboarding,
    lastActiveTab,
    isLoading,
    completeOnboarding,
    setLastActiveTab,
    setLoading
  }
}