import { Types } from 'mongoose';
import { BaseDocument } from './base.types';

export interface UserDocument extends BaseDocument {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'seller';
  managedProducers?: Types.ObjectId[];
  isActive: boolean;
}

export interface UpdateUserBody {
  name?: string;
  email?: string;
  role?: 'admin' | 'user' | 'seller';
  isActive?: boolean;
  [key: string]: any;
}

export interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: string;
} 