import { Types } from 'mongoose';
import { BaseDocument } from './base.types';
import { UserRole, Permission } from '../common/permissions.types';

export interface UserDocument extends BaseDocument {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  permissions?: Permission[];
  status: 'active' | 'inactive';
  avatar?: string;
  bio?: string;
  location?: string;
  phone?: string;
  managedProducers?: Types.ObjectId[];
  settings?: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    language: string;
    currency: string;
    timezone: string;
  };
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    emailNotifications: boolean;
    pushNotifications: boolean;
    newsletter: boolean;
  };
}

export interface UpdateUserBody {
  name?: string;
  email?: string;
  role?: UserRole;
  permissions?: Permission[];
  status?: 'active' | 'inactive';
  avatar?: string;
  bio?: string;
  location?: string;
  phone?: string;
  settings?: Partial<UserDocument['settings']>;
  preferences?: Partial<UserDocument['preferences']>;
}

// Omit both password and managedProducers from base type
export interface PopulatedUser extends Omit<UserDocument, 'password' | 'managedProducers'> {
  // Add back managedProducers with populated type
  managedProducers?: Array<{
    _id: Types.ObjectId;
    name: string;
    email: string;
  }>;
} 