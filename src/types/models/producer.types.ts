import { Types } from 'mongoose';
import { BaseDocument } from './base.types';

export interface ProducerCertification {
  _id?: Types.ObjectId;
  name: string;
  issuer: string;
  validUntil: Date;
  documentUrl: string;
  status: 'active' | 'expired' | 'pending';
}

export interface ProducerDocument extends BaseDocument {
  name: string;
  description?: string;
  email: string;
  phone: string;
  location?: string;
  address?: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
  };
  status: 'active' | 'inactive' | 'pending';
  productsCount: number;
  rating?: number;
  reviews?: Array<{
    userId: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  logo?: string;
  coverImage?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  businessInfo?: {
    taxId: string;
    registrationNumber: string;
    businessType: string;
  };
  certifications: ProducerCertification[];
  documents: Array<{
    _id?: Types.ObjectId;
    name: string;
    type: string;
    url: string;
    status: 'pending' | 'approved' | 'rejected';
    uploadedAt: Date;
    expiresAt?: Date;
    comments?: Array<{
      text: string;
      date: Date;
    }>;
  }>;
  operatingHours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  statusHistory: Array<{
    status: string;
    comment?: string;
    date: Date;
  }>;
}

export interface UpdateProducerBody {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  location?: string;
  address?: ProducerDocument['address'];
  status?: 'active' | 'inactive' | 'pending';
  logo?: string;
  coverImage?: string;
  socialMedia?: ProducerDocument['socialMedia'];
  businessInfo?: ProducerDocument['businessInfo'];
  certifications?: ProducerDocument['certifications'];
  operatingHours?: ProducerDocument['operatingHours'];
}

export interface AssignProducerBody {
  userId: Types.ObjectId;
  producerId: Types.ObjectId;
}

export interface ReviewApplicationBody {
  status: 'approved' | 'rejected';
  feedback?: string;
}

export interface PopulatedProducer extends ProducerDocument {
  products: Array<{
    _id: Types.ObjectId;
    name: string;
    price: number;
    status: string;
  }>;
  managers: Array<{
    _id: Types.ObjectId;
    name: string;
    email: string;
  }>;
}

export type Producer = Omit<ProducerDocument, keyof BaseDocument> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
}; 