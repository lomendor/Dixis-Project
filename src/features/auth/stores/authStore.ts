import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import type { User, LoginCredentials, RegisterData } from '../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (token: string | null, refreshToken: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Auth methods
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<boolean>;
  refreshSession: () => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  resetPasswordRequest: (email: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;

  // Helper methods
  isAdmin: () => boolean;
  isActive: () => boolean;
  getUserPermissions: () => string[];
  getUserGroups: () => string[];
  
  // Initialize auth state
  init: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      // Basic setters
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTokens: (token, refreshToken) => set({ token, refreshToken }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Auth methods
      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          
          // Καθυστέρηση 500ms για να αποφύγουμε το flickering
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const response = await api.post('/auth/login', credentials);
          const { user, token, refreshToken } = response.data;
          
          // Καθυστέρηση 300ms για ομαλή μετάβαση
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set({ 
            user, 
            token, 
            refreshToken,
            isAuthenticated: true,
            error: null,
            isLoading: false
          });
          
          return true;
        } catch (err: any) {
          set({ isLoading: false });
          
          if (err.code === 'ERR_NETWORK') {
            set({ error: 'Αδυναμία σύνδεσης με τον server. Παρακαλώ ελέγξτε τη σύνδεσή σας.' });
          } else if (err.response?.status === 401) {
            set({ error: 'Λάθος email ή κωδικός' });
          } else if (err.response?.status === 429) {
            set({ error: 'Πολλές προσπάθειες σύνδεσης. Παρακαλώ περιμένετε λίγο και δοκιμάστε ξανά.' });
          } else {
            set({ error: 'Σφάλμα κατά τη σύνδεση. Παρακαλώ δοκιμάστε ξανά.' });
          }
          
          return false;
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post('/auth/register', data);
          const { user, token, refreshToken } = response.data;
          
          set({ 
            user, 
            token, 
            refreshToken,
            isAuthenticated: true,
            error: null 
          });
          
          return true;
        } catch (err) {
          set({ error: 'Σφάλμα κατά την εγγραφή' });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          const { token } = get();
          
          if (token) {
            await api.post('/auth/logout');
          }
          
          // Καθαρίζουμε το state
          set({ 
            user: null, 
            token: null, 
            refreshToken: null,
            isAuthenticated: false,
            error: null,
            isLoading: false
          });
          
          // Καθαρίζουμε το localStorage
          localStorage.removeItem('auth-storage');
          
          return true;
        } catch (err: any) {
          console.error('Logout error:', err);
          
          // Ακόμα και αν αποτύχει το API call, καθαρίζουμε το τοπικό state
          set({ 
            user: null, 
            token: null, 
            refreshToken: null,
            isAuthenticated: false,
            error: null,
            isLoading: false
          });
          localStorage.removeItem('auth-storage');
          
          return true;
        }
      },

      refreshSession: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        try {
          set({ isLoading: true });
          const response = await api.post('/auth/refresh', { refreshToken });
          const { token: newToken, refreshToken: newRefreshToken } = response.data;
          
          set({ token: newToken, refreshToken: newRefreshToken });
          return true;
        } catch (err) {
          set({ 
            user: null, 
            token: null, 
            refreshToken: null,
            isAuthenticated: false 
          });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      resetPassword: async (token, password) => {
        try {
          set({ isLoading: true, error: null });
          await api.post('/auth/reset-password', { token, password });
          return true;
        } catch (err) {
          set({ error: 'Σφάλμα κατά την επαναφορά κωδικού' });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      resetPasswordRequest: async (email) => {
        try {
          set({ isLoading: true, error: null });
          await api.post('/auth/forgot-password', { email });
          return true;
        } catch (err) {
          set({ error: 'Σφάλμα κατά την αποστολή email επαναφοράς κωδικού' });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.put('/auth/profile', data);
          const updatedUser = response.data;
          set({ user: updatedUser });
          return true;
        } catch (err) {
          set({ error: 'Σφάλμα κατά την ενημέρωση προφίλ' });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },

      isActive: () => {
        const { user } = get();
        return user?.status === 'active';
      },

      getUserPermissions: () => {
        const { user } = get();
        return user?.permissions || [];
      },

      getUserGroups: () => {
        const { user } = get();
        return user?.groups || [];
      },

      init: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
          set({ 
            token,
            user: JSON.parse(user),
            isAuthenticated: true
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
); 