import { Document, Types } from 'mongoose';

export enum UserRole {
  User = 'user',
  Admin = 'admin',
  Producer = 'producer'
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Banned = 'banned'
}

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UpdateUserBody {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  avatar?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  lastLogin?: Date;
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