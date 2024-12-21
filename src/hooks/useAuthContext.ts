import { createContext } from 'react';
import type { User } from '@/features/auth/types/user';

export const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  error: string | null;
}>({
  user: null,
  loading: false,
  error: null
});

export const useAuthContext = () => {
  // ... existing code ...
}; 