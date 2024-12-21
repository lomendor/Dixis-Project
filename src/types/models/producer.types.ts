import { BaseDocument } from './base.types';

export interface ProducerDocument extends BaseDocument {
  name: string;
  email: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  contactPhone: string;
  logo?: string;
  isActive: boolean;
}

export interface AssignProducerBody {
  sellerId: string;
  producerId: string;
}

export interface ReviewApplicationBody {
  status: 'approved' | 'rejected';
  feedback?: string;
} 