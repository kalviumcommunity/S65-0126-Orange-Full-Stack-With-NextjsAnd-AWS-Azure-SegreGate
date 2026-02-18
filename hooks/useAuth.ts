import { useAuthContext } from "@/context/AuthContext";

export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthContext();

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
}
