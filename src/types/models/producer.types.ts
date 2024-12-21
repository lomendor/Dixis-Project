import { Types } from 'mongoose';
import { BaseDocument } from './base.types';
import { UserDocument } from './user.types';
import { ProductDocument } from './product.types';

export enum ProducerStatus {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending'
}

export interface ProducerAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CompanyInfo {
  name: string;
  vat: string;
  description: string;
}

export interface ProducerDocument extends BaseDocument {
  name: string;
  email: string;
  phone?: string;
  address: ProducerAddress;
  company: CompanyInfo;
  products: Types.ObjectId[];
  seller: Types.ObjectId;
  commission: number;
  status: ProducerStatus;
  profileImage?: string;
  productsCount: number; // Virtual
}

export interface Producer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address: ProducerAddress;
  company: CompanyInfo;
  products: string[];
  seller: string;
  commission: number;
  status: ProducerStatus;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  productsCount: number;
} 