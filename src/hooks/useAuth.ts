import { useAuthStore } from '@/features/auth/stores/authStore';

export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    user: store.user,
    loading: store.isLoading,
    error: store.error,
    login: store.login,
    logout: store.logout,
    register: store.register,
    resetPassword: store.resetPassword,
    resetPasswordRequest: store.resetPasswordRequest,
    updateProfile: store.updateProfile,
    isAdmin: store.isAdmin,
    isAuthenticated: store.isAuthenticated,
    isActive: store.isActive,
    getUserPermissions: store.getUserPermissions,
    getUserGroups: store.getUserGroups
  };
}; 