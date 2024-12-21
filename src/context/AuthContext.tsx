import React, { createContext, useContext, useState } from 'react';
import { useAuthStore } from '@/features/auth/stores/authStore';
import type { User, LoginCredentials, RegisterData } from '@/features/auth/types/user';

// Τύπος για το context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  resetPasswordRequest: (email: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  isAdmin: () => boolean;
  isActive: () => boolean;
  getUserPermissions: () => string[];
  getUserGroups: () => string[];
}

// Δημιουργία του context με default value null
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    resetPassword,
    resetPasswordRequest,
    updateProfile,
    isAdmin,
    isActive,
    getUserPermissions,
    getUserGroups
  } = useAuthStore();

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    logout,
    resetPassword,
    resetPasswordRequest,
    updateProfile,
    isAdmin,
    isActive,
    getUserPermissions,
    getUserGroups
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext, AuthProvider, useAuthContext }; 