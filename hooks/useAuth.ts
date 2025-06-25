import { useAuthStore } from "@/stores/useAuthStore";

export function useAuth() {
  const { session, user, isAuthenticating, isAuthenticated } = useAuthStore();

  return {
    session,
    user,
    isAuthenticating,
    isAuthenticated
  }
}