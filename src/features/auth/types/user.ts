import { Permission } from '@/types/permissions';

export type UserRole = 'admin' | 'producer' | 'consumer';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  permissions: string[];
  groups: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends Omit<User, '_id' | 'role' | 'status' | 'permissions' | 'groups'> {
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileData extends Partial<Omit<User, '_id' | 'email' | 'role'>> {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
} 